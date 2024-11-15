import React from 'react'
import Item from './Item'



const ListItem = (props) => {
    let { data } = props

    return (
        <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
            {data.map(item => {
                return (
                    <Item
                        key={item.id}
                        item={item}
                        onItemChange={props.onItemChange}
                    />
                )
            })}
        </div>
    )
}

export default ListItem