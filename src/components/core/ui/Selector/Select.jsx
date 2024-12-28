import { brands } from './helper';
import {useState, useEffect} from 'react';
import { classNames } from '../../../../utils/styling'

const Select = ({ selectedBrand }) => {
    const [selected, setSelected] = useState('All brands');
    useEffect(() => {
        selectedBrand(selected);
    }, [selected])
    return (
        <select className="select select-secondary w-full max-w-xs" defaultValue={selected} onChange={e => setSelected(e.target.value)}>
            <option disabled value={selected}>Pick your favorite brand</option>
            {brands.map((brand, index) => (
                <option key={index} className={classNames(
                    selected === brand? 'text-white bg-indigo-600' : 'text-gray-900',
                    'py-2 px-4'
                )}>
                    {brand}
                </option>
            ))}
        </select>
    )
}

export default Select;
