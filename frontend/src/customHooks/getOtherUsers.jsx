import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setOtherUsers } from "../redux/userSlice"

const useGetOtherUsers = () => {
  const dispatch = useDispatch()
  const { userData, otherUsers } = useSelector(state => state.user)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/others`, {
          withCredentials: true,
        })
        dispatch(setOtherUsers(result.data))
      } catch (error) {
        console.log("Error fetching other users:", error)
      }
    }

    if (userData?._id) {
      fetchUsers()
    }
  }, [dispatch, userData?._id])

  return otherUsers
}

export default useGetOtherUsers
