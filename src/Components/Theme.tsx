import React , {useEffect} from 'react' 

export default function ThemeInitializer() {
    useEffect(() => {
      try {
        const theme = localStorage.getItem('theme')
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } catch (e : any) {
        // fail silently
      }
    }, [])
    return null
  }