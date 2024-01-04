import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Loader from 'react-loader-spinner'

import JobCard from '../JobCard'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAIL',
  inProgress: 'IN_PROGRESS',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAIL',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobsList: [],
    profileData: [],
    apiJobsStatus: apiJobsStatusConstants.initial,
    checkboxInputs: [],
    radioInput: '',
    searchInput: '',
  }

  componentDidMount() {
    this.onGetProfileDetails()
    this.onGetJobDetails()
  }

  onGetProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const optionsProfile = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, optionsProfile)
    const fetchedDataProfile = await response.json()
    if (response.ok === true) {
      const profile = fetchedDataProfile.profile_details
      const updatedDataProfile = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      console.log(updatedDataProfile)
      this.setState({
        apiStatus: apiStatusConstants.success,
        profileData: updatedDataProfile,
        responseSuccess: true,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onGetJobDetails = async () => {
    this.setState({apiJobsStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedDataJobs = data.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedDataJobs,
        apiJobsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiStatusConstants.failure})
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.onGetJobDetails)
  }

  onGetInputOption = event => {
    const {checkboxInputs} = this.state
    const inputNotInList = checkboxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.onGetJobDetails,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        // eslint-disable-next-line no-unused-vars
        prevState => ({checkboxInputs: filteredData}),
        this.onGetJobDetails,
      )
    }
  }

  onSuccessProfileView = () => {
    const {profileData, responseSuccess} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    if (responseSuccess) {
      return (
        <div className="profile-container">
          <img src={profileImageUrl} className="profile-icon" alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-description">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onSuccessJobsView = () => {
    const {jobsList} = this.state
    const noOfJobs = jobsList.length > 0
    return noOfJobs ? (
      <>
        <ul className="products-list">
          {jobsList.map(job => (
            <JobCard jobData={job} key={job.id} />
          ))}
        </ul>
      </>
    ) : (
      <div className="no-jobs-container">
        <img
          className="no-jobs-img"
          alt="no jobs"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    )
  }

  onRetryProfile = () => {
    this.onGetProfileDetails()
  }

  onRetryJobs = () => {
    this.onGetJobDetails()
  }

  onFailProfileView = () => (
    <>
      <button
        type="button"
        className="profile-retry-button"
        onClick={this.onRetryProfile}
      >
        Retry
      </button>
    </>
  )

  onFailJobsView = () => (
    <>
      <div className="failure-img-button-container">
        <img
          className="failure-img"
          alt="failure view"
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <div className="jobs-failure-button-container">
          <button
            className="failure-button"
            type="button"
            onClick={this.onRetryJobs}
          >
            Retry
          </button>
        </div>
      </div>
    </>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onGetCheckBoxesView = () => (
    <ul className="check-boxes-container">
      <h1 className="text">Type of Employment</h1>
      {employmentTypesList.map(eachItem => (
        <li className="li-container" key={eachItem.employmentTypeId}>
          <input
            className="input"
            id={eachItem.employmentTypeId}
            type="checkbox"
            onChange={this.onGetInputOption}
          />
          <label className="label" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonView = () => (
    <ul className="radio-button-container">
      <h1 className="text">Salary Range</h1>
      {salaryRangesList.map(eachItem => (
        <li className="li-container" key={eachItem.salaryRangeId}>
          <input
            className="input"
            id={eachItem.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onGetRadioOption}
          />
          <label className="label" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.onGetJobDetails()
    }
  }

  onRenderProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.onFailProfileView()
      case apiStatusConstants.success:
        return this.onSuccessProfileView()
      default:
        return null
    }
  }

  onRenderJobs = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.onFailJobsView()
      case apiStatusConstants.success:
        return this.onSuccessJobsView()
      default:
        return null
    }
  }

  onRenderSearch = () => {
    const {searchInput} = this.state
    return (
      <>
        <input
          className="searchInput"
          type="search"
          value={searchInput}
          placeholder="search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          data-testid="searchButton"
          type="button"
          className="search-button"
          value={searchInput}
          placeholder="Search"
          onClick={this.onSubmitSearchInput}
        >
          <AiOutlineSearch className="search-icon" />
        </button>
      </>
    )
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {checkboxInputs, radioInput, searchInput} = this.state
    return (
      <>
        <Header />
        <div className="body-container">
          <div className="sm-search-container">{this.onRenderSearch()}</div>
          <div className="side-bar-container">
            <div className="profile-render-container">
              {this.onRenderProfile()}
            </div>
            <hr className="hr-line" />

            {this.onGetCheckBoxesView()}
            <hr className="hr-line" />

            {this.onGetRadioButtonView()}
          </div>
          <div className="jobs-container">
            <div className="lg-search-container">{this.onRenderSearch()}</div>
            {this.onRenderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
