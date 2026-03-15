import { test } from '@japa/runner'
import Gateway from '#models/gateway'

test.group('Transactions', (group) => {
  group.each.setup(async () => {
    await Gateway.updateOrCreate({ name: 'Gateway 1' }, { priority: 1, isActive: true })
  })

  test('deve realizar uma compra com sucesso', async ({ client }) => {
    const response = await client
      .post('/compras')
      .header('Accept', 'application/json')
      .json({
        amount: 1000,
        name: 'Iury Morais',
        email: 'iury@exemplo.com',
        cardNumber: '1234123412341234',
        cvv: '123'
      })

    response.assertStatus(201)
  })

  test('deve retornar erro de validação ao enviar dados incompletos', async ({ client }) => {
    const response = await client
      .post('/compras')
      .header('Accept', 'application/json')
      .json({})

    response.assertStatus(422)
  })
})