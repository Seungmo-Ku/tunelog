const JournalsPage = () => {
    return (
        <div>
            Journals Page
        </div>
    )
}
/*
 <div className='grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-5 gap-y-8 w-full'>
 {
 isLoading ?
 Array.from({ length: 5 }).map((_, index) => (
 <Cards.BigSkeleton key={`NewestRatings-Skeleton-${index}`}/>
 )) :
 filteredRatings?.map((rating, index) => {
 switch (rating.type) {
 case SearchType.album:
 const album = albumsById[rating.spotifyId]
 return <Cards.Big imgUrl={album.images[0].url} title={`${album.name}`} subtitle={`${rating.score}/5`} key={`AllRatings-${index}`}/>
 case SearchType.artist:
 const artist = artistsById[rating.spotifyId]
 return <Cards.Big imgUrl={artist.images[0].url} title={`${artist.name}`} subtitle={`${rating.score}/5`} key={`AllRatings-${index}`}/>
 case SearchType.track:
 const track = tracksById[rating.spotifyId]
 return <Cards.Big imgUrl={track.album.images[0].url} title={`${track.name}`} subtitle={`${rating.score}/5`} key={`AllRatings-${index}`}/>
 }
 })
 
 }
 </div>
 */
export default JournalsPage