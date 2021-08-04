import { Badge, Button, Typography } from '@supabase/ui'

const Header = ({
  user,
  isAdmin = false,
  onSelectLogOut = () => {},
  onSelectLogIn = () => {},
}) => {
  return (
    <div className="flex items-center w-full h-16 border-b border-gray-600">
      <div className="max-w-screen-xl w-full flex items-center justify-between mx-auto">
        <img className="h-5 w-auto" src="/img/supabase-dark.svg" alt="" />
        {user ? (
          <div className="flex items-center space-x-6">
            <div className="flex flex-col text-right">
              <Typography.Text className="opacity-50 !text-[12px]">Logged in as:</Typography.Text>
              <Typography.Text className="!text-[12px]">
                {isAdmin && <Badge>Admin</Badge>}
                <span className="ml-2">{user.email}</span>
              </Typography.Text>
            </div>
            <Button type="secondary" onClick={onSelectLogOut}>
              Log out
            </Button>
          </div>
        ) : (
          <Button type="primary" onClick={onSelectLogIn}>
            Log in
          </Button>
        )}
      </div>
    </div>
  )
}

export default Header