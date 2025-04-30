import classNames from 'classnames'
import './TableMobileTabs.scss'


const TableMobileTabs = (props) => {

    const {
        items = [],
    } = props

    return (
        <div className="mobile-tabs">
            <dl className="mobile-tabs__list">
                {items.map(({ key, value, isWide }, index) => (
                    <div
                        className={classNames('mobile-tabs__item', {
                            'mobile-tabs__item--wide': isWide,
                        })}
                        key={index}
                    >
                        <dt className="mobile-tabs__key">{key}</dt>
                        <dd className="mobile-tabs__value">{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}

export default TableMobileTabs
