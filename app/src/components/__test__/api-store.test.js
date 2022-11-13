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

  let _token = null

  test('Create Users', async () => {
    const payload = testUser

    const res = await ApiStore.createUser(payload)

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

  test('Update User', async () => {
    const updated = {
      first_name:'bob',
      last_name: 'dylan'
    }

    const res = await ApiStore.updateUser(testUser.id, _token, updated)

    if (res.error) {
      expect([StatusCodes.BAD_REQUEST, StatusCodes.FORBIDDEN].includes(res.error)).toBeTruthy()
    }
  })

  test('Delete User', async () => {
    const res = await ApiStore.deleteUser(testUser.id, _token)
    if (res.success) {
      expect(res.message).toBe('success')
    }
  })
})



/*
  first_name: bob
  last_name: d
*/
