// WithAuthRedirect.jsx

import { useContext, useEffect } from 'react'
import useUser from 'hooks/useUser';
import { NO_PAGE_FLICKER_CLASSNAME, NoPageFlicker } from './NoPageFlicker'
import { UserContext } from 'lib/contexts';

const handleAuthRedirect = (user, {
  redirectAuthenticatedTo,
  redirectUnAuthenticatedTo,
}) => {
  if (typeof window === 'undefined') return;

  if (!user || user?.isLoggedIn === false) {
    if (redirectUnAuthenticatedTo !== undefined) {
      const url = new URL(redirectUnAuthenticatedTo, window.location.href)
      window.location.replace(url.toString())
    }
  } else {
    if (redirectAuthenticatedTo !== undefined) {
      window.location.replace(redirectAuthenticatedTo);
    }
  }
}

export function WithAuthRedirect({ children, ...props }) {
//   const { user, loadingUser } = useUser();
    const user = useContext(UserContext);

  useEffect(() => {
    document.documentElement.classList.add(NO_PAGE_FLICKER_CLASSNAME);
  }, []);

  if (!user) return <></>;

  handleAuthRedirect(user, props)

  const noPageFlicker = (
    props.suppressFirstRenderFlicker ||
    props.redirectUnAuthenticatedTo ||
    props.redirectAuthenticatedTo
  );

  return (
    <>
      {noPageFlicker && <NoPageFlicker />}
      {children}
    </>
  )
}
