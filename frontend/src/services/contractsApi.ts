import { api } from './api'
import type { SupplierContract } from '../types'

export function fetchContracts(params?: { search?: string; status?: string }) {
  return api.get<SupplierContract[]>('/contracts', { params }).then((res) => res.data)
}

export type ContractPayload = Omit<SupplierContract, 'id'>

export function createContract(payload: ContractPayload) {
  return api.post<SupplierContract>('/contracts', payload).then((res) => res.data)
}

export function updateContract(id: string, payload: ContractPayload) {
  return api.put<SupplierContract>(`/contracts/${id}`, payload).then((res) => res.data)
}

export function deleteContract(id: string) {
  return api.delete(`/contracts/${id}`)
}
