import Link from 'next/link'
import { useRef } from 'react'
import { Badge, Button, Dropdown, IconChevronDown, Typography } from '@supabase/ui'

const Header = ({
  user,
  isAdmin = false,
  onSelectLogOut = () => {},
  onSelectLogIn = () => {},
}) => {

  const browseMemesRef = useRef(null)

  const closeDropdown = () => {
    if (browseMemesRef.current) {
      console.log('browseMemes', browseMemesRef)
      // browseMemesRef.current.click()
    }
  }

  return (
    <div className="flex items-center w-full h-16 border-b border-gray-600">
      <div className="max-w-screen-xl w-full flex items-center justify-between mx-auto">
        <Link href="/">
          <a>
            <img className="h-5 w-auto" src="/img/supabase-dark.svg" alt="" />
          </a>
        </Link>
        {user ? (
          <div className="flex items-center space-x-6">
            <div className="flex flex-col text-right">
              <Typography.Text className="opacity-50 !text-[12px]">Logged in as:</Typography.Text>
              <Typography.Text className="!text-[12px]">
                {isAdmin && <Badge>Admin</Badge>}
                <span className="ml-2">{user.email}</span>
              </Typography.Text>
            </div>
            <Dropdown
              align="end"
              overlay={[
                <div className="hover:bg-gray-800" onClick={closeDropdown}>
                  <Link href="/memes/user">
                    <a>
                      <Dropdown.Misc>
                        <Typography.Text small>Your saved memes</Typography.Text>
                      </Dropdown.Misc>
                    </a>
                  </Link>
                </div>,
                  <div className="hover:bg-gray-800">
                  <Dropdown.Misc>
                    <Typography.Text small>
                      <Link href="/memes/community">
                        <a>Community memes</a>
                      </Link>
                    </Typography.Text>
                  </Dropdown.Misc>
                </div>,
              ]}
            >
              <Button iconRight={<IconChevronDown strokeWidth={2} />}>Browse memes</Button>
            </Dropdown>
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