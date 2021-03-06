type Config = {
  baseUrl: string
}

const dev: string = 'http://localhost:5000/graphql'
const prod: string = '<not yet>'

const config: Config = {
  baseUrl: process.env.NODE_ENV === 'development' ? dev : prod
}

export default config;