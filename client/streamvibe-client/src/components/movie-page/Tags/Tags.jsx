import './Tags.scss'

export const Tags = ({ items = [] }) => (
  <div className="tags">
    <ul className="tags__list">
      {items.map((tag, index) => (
        <li className="tags__item" key={index} data-tag={tag}>{tag}</li>
      ))}
    </ul>
  </div>
)

export default Tags