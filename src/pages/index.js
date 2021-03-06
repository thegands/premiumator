import React, { Component } from 'react'
// import { Link } from "gatsby"
import axios from 'axios'

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"

// const IndexPage = () => (
//   <Layout>
//     <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
//     <h1>Hi people</h1>
//     <p>Welcome to your new Gatsby site.</p>
//     <p>Now go build something great.</p>
//     <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
//       <Image />
//     </div>
//     <Link to="/page-2/">Go to page 2</Link>
//   </Layout>
// )
//
// export default IndexPage

class ClientFetchingExample extends Component {
  state = {
    loading: false,
    error: false,
    apiKey: '',// localStorage.getItem("apikey") ? localStorage.getItem("apikey") : '',
    downloadLink: '',
    cache: {
      filename: '',
      filesize: '',
      isCached: '',
    },
    content: [],
  }

  componentDidMount() {
    this.setState({ apiKey: localStorage.getItem("apikey") })
  //   this.checkCache()
  }

  handleInputChange = event => {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value,
    })
  }

  setApiKey = event => {
    event.preventDefault()
    localStorage.setItem('apikey', this.state.apiKey)
    alert(`Locally Stored API Key has been set to: ${this.state.apiKey}`)
  }

  render() {

    const { filename, filesize, isCached } = this.state.cache
    const apiKey = this.state.apiKey
    const content = this.state.content

    return (
      <Layout>
        <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
        <div style={{ textAlign: 'center', width: '600px', margin: '50px auto' }}>

          <form onSubmit={this.setApiKey}>
            <label>
              API Key
              <input
                type="text"
                name="apiKey"
                value={apiKey}
                onChange={this.handleInputChange}
              />
            </label>
            <button type="submit">Submit</button>
          </form>

          <form onSubmit={this.directDlLink}>
            <label>
              Download Link
              <input
                type="text"
                name="downloadLink"
                onChange={this.handleInputChange}
              />
            </label>
            <button type="submit">Submit</button>
          </form>

{/*
          <div>
            {this.state.loading ? (
              <p>Please hold, checking cache</p>
            ) : filename && filesize ? (
              <>
                <h2>{filename}</h2>
                <h2>{filesize}</h2>
                <h2>{`${isCached}`}</h2>
              </>
            ) : (
              <p>Error checking cache</p>
            )}
          </div>
*/}
          <div>
            {this.state.loading ? (
              <p>Please hold, checking cache</p>
            ) : content ? content.map ((file, index ) => (
                <h2><a href={file.link}>{file.path}</a></h2>
            )) : (
              <p>Error checking cache</p>
            )}
          </div>
        </div>
      </Layout>
    )
  }

  // This data is fetched at run time on the client.
  checkLink = event => {
    event.preventDefault()
    this.setState({ loading: true })

    const params = new URLSearchParams()
    params.append('apikey', this.state.apiKey)//localStorage.getItem("apikey"))
    params.append('items[]', this.state.downloadLink)
    axios
      .post('https://www.premiumize.me/api/cache/check', params)
      .then(response => {
        const filename = response.data.filename
        const filesize = response.data.filesize
        const isCached = response.data.response

        this.setState({
          loading: false,
          cache: {
            ...this.state.cache,
            filename,
            filesize,
            isCached,
          },
        })
      })
      .catch(error => {
        this.setState({ loading: false, error })
      })
  }

  directDlLink = event => {
    event.preventDefault()
    this.setState({ loading: true })

    const params = new URLSearchParams()
    params.append('apikey', this.state.apiKey)//localStorage.getItem("apikey"))
    params.append('src', this.state.downloadLink)
    axios
      .post('https://www.premiumize.me/api/transfer/directdl', params)
      .then(response => {
        const content = response.data.content

        this.setState({
          loading: false,
          content: content,
        })
      })
      .catch(error => {
        this.setState({ loading: false, error })
      })
  }
}

export default ClientFetchingExample
