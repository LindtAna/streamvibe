import AccordionGroup from '@/components/AccordionGroup'
import './Seasons.scss'
import Accordion from '@/components/Accordion'
import seasonItems from '@/components/Seasons/seasonItems'
import EpisodeCard from '@/components/EpisodeCard'

const Seasons = () => {
    return (
        <AccordionGroup
        className="seasons"
            mode="episodes"
            isOrderedList={false}
        >
            {seasonItems.map(({ title, subtitle, episodes }, index) => (
                <Accordion
                    title={title}
                    titleLevelClassName="h4"
                    subtitle={subtitle}
                    id={`season-${index}`}
                    name="seasons"
                    isOpen={index === 1}
                    //   чтобы открыть второй сезон index === 1
                    key={index}
                    isArrowButton
                >
                    <ul className="seasons__list">
                        {episodes.map((episode, index) => (
                            <li className="seasons__item" key={index}>
                                <EpisodeCard {...episode} />
                            </li>
                        ))}
                    </ul>
                </Accordion>
      ))}
    </AccordionGroup>
  )
}

export default Seasons