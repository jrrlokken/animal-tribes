import * as chai from 'chai'
import * as request from 'supertest'
import * as jsonwebtoken from 'jsonwebtoken'

import app from '../index'
import config from '../config'

import { clearDB, createWarrior } from './helpers'
import { IWarrior } from '../models/warrior-model'
import { Tribe } from '../models/tribe-model'

const expect = chai.expect

const queryGetWarrior = `
  {
    warrior {
      id
      name
      warriorname
      tribe
    }
  }
`

const queryGetAllWarriors = `
  {
    warriors {
      id
      name
      warriorname
      tribe
    }
  }
`

const mutationSignup = (
  name: string,
  warriorname: string,
  password: string
) => `
  mutation {
    signup(
      name: "${name}",
      warriorname: "${warriorname}",
      password: "${password}"
    ) {
      warriorname
      name
    }
  }
`

const mutationLogin = (warriorname: string, password: string) => `
  mutation {
    login (warriorname: "${warriorname}", password: "${password}")
    {
      token
      warrior {
        warriorname
        tribe
      }
    }
  }
`

const mutationUpdateTribe = (tribe: Tribe) => `
  mutation {
    updateTribe (tribe: "${tribe}")
    {
      warriorname
      tribe
    }
  }
`

describe('Warrior', () => {
  let warrior: IWarrior
  let server: request.SuperTest<request.Test>
  let token: string
  beforeEach(async () => {
    server = request(app)
    warrior = await createWarrior()
    await createWarrior({ name: 'another name' })
    token = jsonwebtoken.sign({ id: warrior?.id }, config.jwtSecret!, {
      expiresIn: '1d',
    })
  })

  it('should get warrior', (done) => {
    server
      .post('/graphql')
      .set('Authorization', token)
      .send({ query: queryGetWarrior })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err)
        }

        expect(res.body).to.be.an('object')
        expect(res.body.data).to.be.an('object')
        expect(res.body.data.warrior)
          .to.haveOwnProperty('id')
          .equal(warrior?.id)
        expect(res.body.data.warrior)
          .to.haveOwnProperty('name')
          .equal(warrior?.name)
        expect(res.body.data.warrior)
          .to.haveOwnProperty('warriorname')
          .equal(warrior?.warriorname)
        expect(res.body.data.warrior)
          .to.haveOwnProperty('tribe')
          .equals(Tribe.LION)

        done()
      })
  })

  it('should not get warrior with an invalid token', (done) => {
    server
      .post('/graphql')
      .set('Authorization', 'wrong')
      .send({ query: queryGetWarrior })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err)
        }

        expect(res.body.errors).to.be.an('array')
        expect(res.body.errors[0]).to.be.an('object')
        expect(res.body.errors[0].message).equal('jwt malformed')
        expect(res.body.data.warrior).to.be.null

        done()
      })
  })

  
})