import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import Users from '../models/users/UsersSchema.js'
import Programs from '../models/programs/ProgramsSchema.js'
import Classes from '../models/classes/ClassesSchema.js'
import Tracks from '../models/tracks/TracksSchema.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const csvDir = path.join(__dirname, '../data/csv')

const parseCsvLine = (line) => {
  const values = []
  let currentValue = ''
  let insideQuotes = false

  for (const character of line) {
    if (character === '"') {
      insideQuotes = !insideQuotes
    } else if (character === ',' && !insideQuotes) {
      values.push(currentValue.trim())
      currentValue = ''
    } else {
      currentValue += character
    }
  }

  values.push(currentValue.trim())

  return values
}

const readCsv = (fileName) => {
  const filePath = path.join(csvDir, fileName)
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split(/\r?\n/).filter(Boolean)
  const headers = parseCsvLine(lines[0])

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)

    return headers.reduce((row, header, index) => {
      row[header] = values[index] || ''
      return row
    }, {})
  })
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)

    const usersCsv = readCsv('users.csv')
    const programsCsv = readCsv('programs.csv')
    const classesCsv = readCsv('classes.csv')
    const tracksCsv = readCsv('tracks.csv')

    await Tracks.deleteMany()
    await Classes.deleteMany()
    await Programs.deleteMany()
    await Users.deleteMany()

    const hashedUsersData = await Promise.all(
      usersCsv.map(async (user) => ({
        name: user.name,
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
        role: user.role,
        avatar: user.avatar
      }))
    )

    const users = await Users.insertMany(hashedUsersData)
    const usersByEmail = new Map(users.map((user) => [user.email, user]))

    const programsData = programsCsv.map((program) => ({
      name: program.name,
      description: program.description,
      image: program.image
    }))

    const programs = await Programs.insertMany(programsData)
    const programsByName = new Map(programs.map((program) => [program.name, program]))

    const classesData = classesCsv.map((classItem) => ({
      title: classItem.title,
      program: programsByName.get(classItem.programName)._id,
      trainer: usersByEmail.get(classItem.trainerEmail)._id,
      level: classItem.level,
      duration: Number(classItem.duration),
      image: classItem.image
    }))

    const classes = await Classes.insertMany(classesData)
    const classesByTitle = new Map(classes.map((classItem) => [classItem.title, classItem]))

    const tracksData = tracksCsv.map((track) => ({
      title: track.title,
      class: classesByTitle.get(track.classTitle)._id,
      trainer: usersByEmail.get(track.trainerEmail)._id,
      order: Number(track.order),
      duration: Number(track.duration),
      videoUrl: track.videoUrl,
      focus: track.focus
    }))

    const tracks = await Tracks.insertMany(tracksData)

    console.log(`Usuarios creados: ${users.length}`)
    console.log(`Programas creados: ${programs.length}`)
    console.log(`Clases creadas: ${classes.length}`)
    console.log(`Tracks creados: ${tracks.length}`)

    await mongoose.disconnect()
  } catch (error) {
    console.error('Error ejecutando la semilla:', error.message)
    await mongoose.disconnect()
    process.exit(1)
  }
}

seedDatabase()
