import useAuth from '../../hooks/useAuth'
import Saved from './Saved'
import SavedPublic from './SavedPublic'

const SavedPage = () => {
  const { auth } = useAuth()
  
  return auth ? <Saved /> : <SavedPublic />
}

export default SavedPage