import './ClassCard.scss'
import { Link } from 'react-router'

const ClassCard =({id,title, trainer, level, duration, src, program, isCompleted})=>{
    return(
        <Link to={`/classes/${id}`}>
            <article className='class-card'>
                {isCompleted && (
                    <span className='class-card__completed'>✓ Completada</span>
                )}
                <p className='class-card__program'> {program} </p>
                <div className='class-card__img-container'>
                    <img className='class-card__img' src={src} alt={title} />
                </div>
                <span className='class-card__level'>{level} </span>
                <h2 className='class-card__title'> {title} </h2>
                <p className='class-card__trainer'>Con {trainer} </p>
                <p className='class-card__duration'> {duration} min </p>
            </article>
        </Link>
    )
}

export default ClassCard
