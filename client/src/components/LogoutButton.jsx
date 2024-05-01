
import { Button } from "@chakra-ui/button";
import { useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { selectedConversationAtom } from '../../atoms/messagesAtom'
import postsAtom from "../../atoms/postsAtom";

const LogoutButton = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();
	const navigate = useNavigate();
	const setSelectedConversations = useSetRecoilState(selectedConversationAtom);
	const setPosts = useSetRecoilState(postsAtom);
	const handleLogout = async () => {
		try {
			const res = await fetch(import.meta.env.VITE_LOGOUT_API, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.removeItem("user-threads");
			setUser(null);
			setSelectedConversations([]);
			setPosts([]);
			navigate("/");
            
		} catch (error) {
			showToast("Error", error, "error");
		}
	};
	return (
		<Button size={"sm"} onClick={handleLogout} variant={"ghost"}>
			<AiOutlineLogout size={24} />
		</Button>
	);
};

export default LogoutButton;
