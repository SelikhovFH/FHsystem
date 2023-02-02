export interface Device {
  _id: string
  name: string
  type: DeviceType
  screenSize?: number
  cpu?: string
  ram?: number
  storage?: number
  serialNumber?: string
  owner: deviceOwnerUnion
  assignedTo: string | null
  notes?: string

}

export type deviceOwnerUnion = 'FH' | 'Personal' | string


export enum DeviceType {
  laptop = 'laptop',
  monitor = 'monitor',
  other = 'other',
  network = 'network',
  printer = 'printer',
  tv = 'tv',
  adapter = 'adapter'
}
