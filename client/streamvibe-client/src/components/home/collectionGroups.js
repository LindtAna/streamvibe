import InterstellarSPosterImgSrc from '../../assets/test-images/interstellar-s.jpg'

const categorySliderParams = {
    slidesPerView: 4,
    slidesPerGroup: 10,
    spaceBetween: 30,
    breakpoints: {
        0: { slidesPerView: 1.6, slidesPerGroup: 1, spaceBetween: 20 },
        481: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
        1024: { spaceBetween: 20 },
        1441: { spaceBetween: 30 },
    },
}


const moviesCollection = [
    { title: 'Interstellar', imgSrc: InterstellarSPosterImgSrc, duration: '2h 30min', rating: { value: 4.5, label: '20K' } },
    { title: 'Interstellar', imgSrc: InterstellarSPosterImgSrc, duration: '2h 30min', rating: { value: 4.5, label: '20K' } },
    { title: 'Interstellar', imgSrc: InterstellarSPosterImgSrc, duration: '2h 30min', rating: { value: 4.5, label: '20K' } },
    { title: 'Interstellar', imgSrc: InterstellarSPosterImgSrc, duration: '2h 30min', rating: { value: 4.5, label: '20K' } },
    { title: 'Interstellar', imgSrc: InterstellarSPosterImgSrc, duration: '2h 30min', rating: { value: 4.5, label: '20K' } },
    { title: 'Interstellar', imgSrc: InterstellarSPosterImgSrc, duration: '2h 30min', rating: { value: 4.5, label: '20K' } },
    { title: 'Interstellar', imgSrc: InterstellarSPosterImgSrc, duration: '2h 30min', rating: { value: 4.5, label: '20K' } },
    { title: 'Interstellar', imgSrc: InterstellarSPosterImgSrc, duration: '2h 30min', rating: { value: 4.5, label: '20K' } },
]

const collectionGroups = [
    {
        title: 'Movies',
        isActive: true,
        items: [
            {
                title: 'Our Collection',
                movieItems: moviesCollection,
                sliderParams: categorySliderParams,
            },
            {
                title: 'Comedy',
                movieItems: moviesCollection,
                sliderParams: categorySliderParams,
            },
            {
                title: 'Drama',
                movieItems: moviesCollection,
                sliderParams: categorySliderParams,
            },
        ],
    }
]

export default collectionGroups