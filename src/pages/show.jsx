import Seasons from "@/components/Seasons"
import ShowDetails from "@/sections/ShowDetails"
import ShowBanner from "@/sections/ShowBanner"

export const metadata = {
    title: 'Show - Stranger Things ',
  }
  
  export default () => {
    return (
      <>
     <ShowBanner />
     <ShowDetails 
     seasons={<Seasons />}
     />
      </>
    )
  }