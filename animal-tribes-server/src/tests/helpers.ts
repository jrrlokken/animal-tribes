import Warrior, { IWarrior } from '../models/warrior-model'
import Skill, { ISkill } from '../models/skill-model'
import { Tribe } from '../models/tribe-model'

export async function clearDB(): Promise<void> {
  await Warrior.deleteMany({})
  await Skill.deleteMany({})
}

export function createWarrior(attrs = {}): Promise<IWarrior> {
  const warrior = new Warrior(
    Object.assign(
      {
        name: 'Test',
        warriorname: 'testname',
        password: 'testpass',
        tribe: Tribe.LION,
      },
      attrs || {}
    )
  )

  return warrior.save()
}

export async function createSkill(attrs = {}): Promise<ISkill> {
  const warrior = new Warrior(
    Object.assign(
      {
        name: 'Test',
        warriorname: 'testname',
        password: 'testpass',
        tribe: Tribe.LION,
      },
      attrs || {}
    )
  )

  await warrior.save()

  const skill = new Skill({
    warriorId: warrior.id,
    strength: 60,
    dexterity: 60,
    faith: 60,
    wisdom: 60,
    magic: 60,
    agility: 60,
  })

  return skill.save()
}