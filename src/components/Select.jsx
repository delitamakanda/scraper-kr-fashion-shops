import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid'

const brands = [
  {
    id: 1,
    name: 'All',
    count: 0,
  },
  {
    id: 2,
    name: 'Maybe Baby',
    count: 0,
  },
  {
    id: 3,
    name: 'Stylenanda',
    count: 0,
  },
  {
    id: 4,
    name: 'Frombeginning',
    count: 0,
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function filteredProductsByBrand(products, category) {
  return category !== 'All' ? products.filter((product) => product.source === category) : products
} 

function prepareCount(products, count) {
  products.forEach((product) => {
      brands.map((brand) => {
        if (brand.name === 'All') {
          brand.count = count
        } else if (brand.name === product.source) {
          brand.count = product.countProductsByBrand
        }
        return { ...brand }
      })
    })
}

const Select = ({onSelectProducts, countProducts, dataChildToParent}) => {
  const [selected, setSelected] = useState(brands[0])
  const filteredItems = filteredProductsByBrand(onSelectProducts, selected.name)
  prepareCount(filteredItems, countProducts)

  useEffect(() => {
    dataChildToParent(selected);
  }, [selected])
  
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">Filter by</Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selected.name} ({selected.count})</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {brands.map((brand) => (
                  <Listbox.Option
                    key={brand.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={brand}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {brand.name} ({brand.count})
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}

export default Select;