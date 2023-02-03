export interface Item {
    _id: string
    name: string
    description?: string
    quantity: number
    size?: ItemSize
}

export enum ItemSize {
    xs = 'xs',
    s = 's',
    m = 'm',
    l = 'l',
    xl = 'xl',
    xxl = 'xxl',
    xxxl = 'xxxl'
}
