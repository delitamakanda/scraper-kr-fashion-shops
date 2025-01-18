import {LazyLoadImage} from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
const PlaceholderImage = '../assets/dummy_275x360_ffffff_cccccc.png';

export function ProductGrid({ products, toggleLiked, productIsLiked }) {
    return (
        <div
            className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
            {products.map(product => (
                    <div key={product.id} className="group relative">
                        <div
                            className="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                            <LazyLoadImage src={product.image_url} alt={product.name}
                                           height={'100%'}
                                           width={'100%'} placeholdersrc={PlaceholderImage}
                                           className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                                           effect="blur"/>

                        </div>

                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-sm text-gray-700">
                                    <a rel='noreferrer' href={product.external_link} target="_blank"
                                       tabIndex={product.id}>
                                                            <span aria-hidden="true"
                                                                  className="absolute inset-0"></span>
                                        {product.name}
                                    </a>
                                </h3>
                            </div>
                            <button onClick={toggleLiked(product.id)} className="appearance-none absolute top-0 right-0">
                                {!productIsLiked(product.id) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                         viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                         className="size-6 h-8 w-8">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                                    </svg>
                                ) : (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                          fill="currentColor" className="size-6 h-8 w-8">
                                    <path
                                        d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"/>
                                </svg>)}
                            </button>
                            <p className="text-sm font-medium text-gray-900">${product.price}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}