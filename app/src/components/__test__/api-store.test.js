import {describe, expect, test} from '@jest/globals'
import StatusCodes from 'http-status-codes'
import ApiStore from '../api-store'

describe('Class: ApiStore', () => {
  let testUser = {
    email: 'test@test.test',
    first_name: 'Dummy',
    last_name: 'Tester',
    password: '12345'
  }

  let testProject = {
    name: "TestProject",
    description: "a simple project",
    size: 4,
    tag: 'sports'
  }

  let _token = null

  test('Create Users', async () => {

    const res = await ApiStore.createUser(testUser)

    if (res.error) {
      expect(res.error).toBe(StatusCodes.BAD_REQUEST)
    }
    expect(res.error).toBeUndefined()

    const { id } = res
    testUser['id'] = id
  })

  test('Get Tokens', async () => {
    const res = await ApiStore.getToken(testUser)

    if (res.error) {
      expect(res.error).toBe(StatusCodes.UNAUTHORIZED)
    }

    const { token } = res
    _token = token
  })

  test('Get all Users', async () => {
    const res = await ApiStore.getUsers(_token)

    if (res.error) {
      expect([StatusCodes.BAD_REQUEST, StatusCodes.UNAUTHORIZED].includes(res.error)).toBeTruthy()
    }

    expect(res._links).not.toBeNull()
    expect(res._meta).not.toBeNull()
    expect(res.items).not.toBeNull()
  })

  test('Get user by id', async () => {
    const res = await ApiStore.getUserById(testUser.id, _token)

    if (res.error) {
      expect([StatusCodes.BAD_REQUEST, StatusCodes.UNAUTHORIZED].includes(res.error)).toBeTruthy()
    }

    expect(res.id).not.toBeNull()
  })

  test('Update User', async () => {
    const updated = {
      first_name:'bob',
      last_name: 'dylan'
    }

    const res = await ApiStore.updateUser(testUser.id, _token, updated)

    if (res.error) {
      expect([StatusCodes.BAD_REQUEST, StatusCodes.FORBIDDEN].includes(res.error)).toBeTruthy()
    }

    expect(res.id).not.toBeNull()
  })

  test('Create Projects', async () => {
    const res = await ApiStore.createProject(_token, testProject)
    testProject['id'] = res.id
  })

  test('Get Projects', async () => {
    const res = await ApiStore.getProjects(_token)
  })

  test('Get Project By Id', async () => {
    const res = await ApiStore.getProjectById(testProject['id'], _token)
  })

  test('Update Project', async () => {
    const update = {
      description: 'hello world'
    }

    const rest = await ApiStore.updateProject(testProject['id'], _token, update)
  })

  test('Publish Project', async () => {
    const res = await ApiStore.publishProject(testProject['id'], _token)
  })

  test('Delete Projects', async () => {
    const res = await ApiStore.deleteProject(testProject.id, _token)
  })

  test('Delete User', async () => {
    const res = await ApiStore.deleteUser(testUser.id, _token)
    if (res.success) {
      expect(res.message).toBe('success')
    }

    if (res.error) {
      expect([StatusCodes.BAD_REQUEST, StatusCodes.FORBIDDEN].includes(res.error)).toBeTruthy()
    }
  })
})
