import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  return (
    <li className="job-item">
      <div className="job-logo-title-card">
        <img
          src={companyLogoUrl}
          className="company-logo"
          alt="job details company logo"
        />
        <div className="job-rating-container">
          <h1 className="title">{title}</h1>
          <p className="rating">{rating}</p>
        </div>
      </div>
      <div className="location-type-package-card">
        <div className="location-type">
          <p className="location">{location}</p>
          <p className="type">{employmentType}</p>
        </div>
        <h1 className="package">{packagePerAnnum}</h1>
      </div>
      <hr color="#475569" />
      <div className="about-section">
        <h1 className="heading">Description</h1>
        <p className="description">{jobDescription}</p>
      </div>
    </li>
  )
}

export default JobCard
