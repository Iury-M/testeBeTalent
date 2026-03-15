import Transaction from '#models/transaction'
import Gateway from '#models/gateway'
import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class TransactionsController {
  static validator = vine.compile(
    vine.object({
      amount: vine.number(),
      name: vine.string(),
      email: vine.string().email(),
      cardNumber: vine.string().fixedLength(16),
      cvv: vine.string().minLength(3).maxLength(4),
    })
  )

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(TransactionsController.validator)

    // Busca ou cria o cliente (Cumpre requisito da tabela clients)
    const client = await Client.firstOrCreate(
      { email: data.email },
      { name: data.name }
    )

    const activeGateways = await Gateway.query().where('is_active', true).orderBy('priority', 'asc')

    let transactionStatus: 'paid' | 'failed' = 'failed'
    let externalId: string | null = null
    let usedGatewayName = 'Nenhum'
    let usedGatewayId: number | null = null

    for (const gateway of activeGateways) {
      try {
        const isGateway1 = gateway.name === 'Gateway 1'
        const url = isGateway1 ? 'http://127.0.0.1:3001/transactions' : 'http://127.0.0.1:3002/transacoes'
        const payload = isGateway1
          ? { amount: data.amount, name: data.name, email: data.email, cardNumber: data.cardNumber, cvv: data.cvv }
          : { valor: data.amount, nome: data.name, email: data.email, numeroCartao: data.cardNumber, cvv: data.cvv }

        const apiResponse = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (apiResponse.ok) {
          const result = (await apiResponse.json()) as any
          transactionStatus = 'paid'
          externalId = String(result.id || result.external_id)
          usedGatewayName = gateway.name
          usedGatewayId = gateway.id
          break
        }
      } catch (error) {}
    }

    const transaction = await Transaction.create({
      clientId: client.id,
      gatewayId: usedGatewayId,
      amount: data.amount,
      gatewayName: usedGatewayName,
      externalId,
      status: transactionStatus,
      cardLastNumbers: data.cardNumber.slice(-4),
    })

    return response.status(transactionStatus === 'paid' ? 201 : 400).send(transaction)
  }

  // Listar todas as compras (Obrigatório)
  async index({ response }: HttpContext) {
    const transactions = await Transaction.query().preload('client').orderBy('created_at', 'desc')
    return response.ok(transactions)
  }

  // Detalhes de uma compra (Obrigatório)
  async show({ params, response }: HttpContext) {
    const transaction = await Transaction.query().where('id', params.id).preload('client').firstOrFail()
    return response.ok(transaction)
  }
}