import { api } from './api'
import type { SupplierContract } from '../types'

export function fetchContracts(params?: { search?: string; status?: string }) {
  return api.get<SupplierContract[]>('/contracts', { params }).then((res) => res.data)
}

export type CreateContractPayload = Omit<SupplierContract, 'id'>

export function createContract(payload: CreateContractPayload) {
  return api.post<SupplierContract>('/contracts', payload).then((res) => res.data)
}

export function deleteContract(id: string) {
  return api.delete(`/contracts/${id}`)
}
