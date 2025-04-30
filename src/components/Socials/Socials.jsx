import classNames from 'classnames'
import './Socials.scss'
import Button from '@/components/Button'

const Socials = (props) => {
    const {
        className,
        links = [],
        iconSrc,

    } = props


    return (
        <div className={classNames(className, 'soc1als')}>
            <ul className="soc1als__list">
                {links.map(({ label, iconName, iconSrc }, index) => (
                    <li className="soc1als__item" key={index}>
                        <Button
                            className="soc1als__link"
                            mode = "black-10"
                            href="/"
                            target="_blank"
                            label={label}
                            isLabelHidden
                            iconName={iconName}
                            iconSrc={iconSrc}
                            hasFillIcon
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Socials