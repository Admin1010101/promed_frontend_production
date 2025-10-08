import React from 'react'
import {products} from '../../utils/data/index'

const Services = () => {
  return (
    <section>
        <div>
            {
              products.map((product) => (
                <h1>{product.name}</h1>
              ))
            }
        </div>
    </section>
  )
}

export default Services