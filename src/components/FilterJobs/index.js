import './index.css'

const FilterJobs = props => {
  const renderEmploymentTypeList = () => {
    const {employmentTypesList} = props

    return employmentTypesList.map(type => {
      const {label, employmentTypeId} = props
      const onClickEmploymentType = () => changeType(type.employmentTypeId)
      const isActive = type.employmentTypeId === employmentTypeId
      const typeClassName = isActive
        ? `type-name active-type-name`
        : `type-name`

      return (
        <li
          className="employment-type"
          key={type.employmentTypeId}
          onClick={onClickEmploymentType}
        >
          <input type="checked" className="type-input" />
          <p className={typeClassName}>{type.label}</p>
        </li>
      )
    })
  }

  const renderEmploymentType = () => (
    <>
      <h1 className="category-heading">Category</h1>
      <ul className="categories-list">{renderEmploymentTypeList()}</ul>
    </>
  )

  return <div className="filters-job-container">{renderEmploymentType()}</div>
}

export default FilterJobs
