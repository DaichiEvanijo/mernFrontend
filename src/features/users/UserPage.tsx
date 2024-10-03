import { useAppSelector } from "../../app/hooks";
import { selectUserById, userStatus } from "./usersSlice";
import { selectPostByAuthor } from "../posts/postsSlice";
import { useParams, Link } from "react-router-dom";

type RouterParams = {
  userId: string;
};

const UserPage = () => {
  const { userId } = useParams<RouterParams>();
  const user = userId ? useAppSelector((state) => selectUserById(state, userId)):null
  const status = useAppSelector(userStatus);
  const postsForUser = useAppSelector((state) => user ? selectPostByAuthor(state, user.username) : []);

  // ページをrefreshしたときにusersがfetchされる前このシートが呼ばれてエラーが出るのを防ぐ
  if (status === "loading") {
    return (
      <section>
        <h2>Loading...</h2>
      </section>
    );
  }

  if (!user) {
    return (
      <section>
        <h2>User not found !!</h2>
      </section>
    );
  }

  const postTitles = postsForUser.map((post) => (
    <li key={post._id}>
      <Link to={`/post/${post._id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section className="userpage">
      <h2>{`${user.username}'s Posts`}</h2>
      <ol>{postTitles}</ol>
    </section>
  );
};

export default UserPage;

// SinglePostPageとの比較
// Login後、UserPageに行きをリフレッシュすると、PersistLoginにより再びauth stateが復活して、
// その後Appコンポで書いたfetchUsersが開始する、それと同時にUserPageが読まれ、その時点では
// userという変数は空なのでエラーになってしまう。なのでstatus === "loading"のコードでその場合は
// is Loadingのp要素を返し、それより下はこの条件をクリアしたもののみとなるので結局"loading"から"scceed"に
// なって初めて下のコードが読まれエラーなく表示される
