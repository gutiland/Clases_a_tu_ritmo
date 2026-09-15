import ClassCard from "../../components/ClassCard/ClassCard"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import './Catalog.scss'
import { API_URL } from '../../config/api'

const Catalog =()=>{
    const { token, isAuthenticated } = useAuth()

    const [selectedLevel, setSelectedLevel] = useState("all")
    const [search, setSearch] = useState("")
    const [classes, setClasses]= useState([])
    const [completedClassIds, setCompletedClassIds] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]= useState('')
    const getTrainerName = (trainer) => {
        if (typeof trainer === 'string') {
            return trainer
        }

        return trainer?.name || ''
    }
    const getProgramName =(program)=>{
        if(typeof program === 'string'){
            return program
        }

        return program?.name || ''
    }
    

    useEffect(()=>{
        const controller = new AbortController()

        const loadClasses = async()=>{
            try {
                const response = await fetch(`${API_URL}/api/classes`,{
                    signal:controller.signal,
                })
                if(!response.ok){
                    throw new Error('No se pudieron cargar las clases')
                }
                const data = await response.json()
                setClasses(data)
            } catch (error) {
                if(error.name!== 'AbortError'){
                    setError('No se pudieron cargar las clases')
                }
            } finally{
                if(!controller.signal.aborted){
                    setLoading(false)
                }
            }
        
    }
    loadClasses()
    return ()=> controller.abort()
    },[])

    useEffect(()=>{
        if (!isAuthenticated) {
            setCompletedClassIds([])
            return
        }

        const controller = new AbortController()

        const loadCompletedClasses = async()=>{
            try {
                const response = await fetch(`${API_URL}/api/workouts/me`,{
                    headers:{
                        Authorization: `Bearer ${token}`
                    },
                    signal:controller.signal,
                })

                if(!response.ok){
                    throw new Error('No se pudieron cargar las clases completadas')
                }

                const data = await response.json()
                const classIds = data
                    .map((session)=> session.class?._id || session.class)
                    .filter(Boolean)

                setCompletedClassIds(classIds)
            } catch (error) {
                if(error.name!== 'AbortError'){
                    setCompletedClassIds([])
                }
            }
        }

        loadCompletedClasses()

        return ()=> controller.abort()
    },[isAuthenticated, token])
    

    const filteredClasses = classes.filter((classItem)=> {
        /* BUSCADOR POR INTENSIDAD EN SELECT */
        const matchesLevel = selectedLevel ==="all" || classItem.level === selectedLevel
        
        /* BUSCADOR POR NOMBRE O TRAINER EN INPUT TIPO TEXTO */
        const query = search.trim().toLowerCase()
        const trainerName = getTrainerName(classItem.trainer)
        const programName = getProgramName(classItem.program)
        const matchesSearch = 
        classItem.title?.toLowerCase().includes(query) ||
        trainerName.toLowerCase().includes(query) ||
        programName.toLowerCase().includes(query)

    
       return matchesLevel && matchesSearch
    }
    )
    
    return(

 <main className='container catalog'>
      <h1>Catálogo de clases</h1>
      <p className="catalog__description">Encuentra tus clases y sigue a tu entrenador.</p>
      
      {/* BUSQUEDA POR ENTRENADOR O NOMBRE */}
      <div className="catalog__search">
        <label htmlFor="search">Busca tu clase, programa o entrenador</label>
        <input 
        type="text"
        value={search}
        onChange={(e)=>{
            setSearch(e.target.value)
        }}
        placeholder="Ej, Laura, Dance cardio o core" >

        </input>

      </div>



      {/* FILTRO DE NIVEL */}
      
      <div className="catalog__filter">
        <label htmlFor="level">Busca por intensidad</label>
        <select id="level"
        value={selectedLevel}
        onChange={(e)=>{
            setSelectedLevel(e.target.value)
        }}>
            <option value={"all"}>Todas las intensidades</option>
            <option value={"Principiante"}>Principiantes</option>
            <option value={"Intermedio"}>Intermedio</option>
            <option value={"Avanzado"}>Avanzado</option>
        </select>
      </div>

      {loading && (
        <p role="status">Cargando clases...</p>
      )}
      {error &&(
        <p className="catalog__status" role="alert">{error} </p>
      )}
      {!loading && !error && filteredClasses.length === 0 && (
        <p className="catalog__status" role="status">
            No encontramos clases con esa búsqueda
        </p>
      )}
      {/* GRID DE CLASES */}
      <div className='classes-grid'>
        {filteredClasses.map((classItem)=>(
          <ClassCard key={classItem._id || classItem.id}
          id={classItem._id || classItem.id}
          program={classItem.program?.name || classItem.program}
            title={classItem.title}
            trainer={getTrainerName(classItem.trainer)}
            level={classItem.level}
            duration={classItem.duration}
            src={classItem.image || classItem.src}
            isCompleted={completedClassIds.includes(classItem._id || classItem.id)} />
          )
        )}
            
      </div>
    </main>

    )
}
export default Catalog
