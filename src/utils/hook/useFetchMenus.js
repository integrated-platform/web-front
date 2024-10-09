// useFetchMenus.js
import { useEffect, useState } from 'react';
import { Icon } from '@mui/material';

const useFetchMenus = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menuData = await privateApiRequest('/menus', 'GET');
        const formattedRoutes = menuData.map(menu => ({
          type: "collapse",
          name: menu.commonCode.name,
          key: menu.menuCode,
          icon: <Icon fontSize="small">{menu.icon}</Icon>,
          route: menu.route,
          component: componentMap[menu.key] || null,
        }));
        setRoutes(formattedRoutes);
      } catch (error) {
        console.error('Error fetching menu data:', error.message);
      }
    };

    fetchMenus();
  }, []);

  return routes;
};

export default useFetchMenus;
