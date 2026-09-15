import Tracks from '../models/tracks/TracksSchema.js'
import Classes from '../models/classes/ClassesSchema.js'

export const getTracks = async (req, res) => {
  try {
    const allTracks = await Tracks.find()
    .populate('class')
    .populate('trainer')

    return res.status(200).json(allTracks)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los tracks',
      error: error.message
    })
  }
}

export const getTrackById = async (req, res) => {
  try {
    const track = await Tracks.findById(req.params.trackId)
      .populate('class')
      .populate('trainer', '-password')

    if (!track) {
      return res.status(404).json({
        message: 'Track no encontrado'
      })
    }

    return res.status(200).json(track)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el track',
      error: error.message
    })
  }
}

export const getTracksByClass = async (req, res) => {
  try {
    const tracks = await Tracks.find({ class: req.params.classId })
      .sort({ order: 1 })
      .populate('class')
      .populate('trainer', '-password')

    return res.status(200).json(tracks)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los tracks de la clase',
      error: error.message
    })
  }
}

export const getTrackByClass = async (req, res) => {
  try {
    const track = await Tracks.findOne({
      _id: req.params.trackId,
      class: req.params.classId
    })
      .populate('class')
      .populate('trainer', '-password')

    if (!track) {
      return res.status(404).json({
        message: 'Track no encontrado para esta clase'
      })
    }

    return res.status(200).json(track)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el track',
      error: error.message
    })
  }
}


export const createTrack= async(req,res)=>{
  try {
    const {classId} = req.params
    const {title, order, duration, videoUrl, focus} = req.body
    const classExists = await Classes.findById(classId)
    if (!classExists) {
      return res.status(404).json({
        message: 'Clase no encontrada'
      })
    }
    const newTrack = await Tracks.create({
      title,
      class:classId,
      trainer: req.user._id,
      order,
      duration,
      videoUrl,
      focus
    })
    const populatedTrack = await newTrack.populate([
      {path:'class'},
      {path: 'trainer', select: '-password'}
    ])
    return res.status(201).json(populatedTrack)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear el track',
      error: error.message
    })
  }
}
