// menu.js

// globals
var menuLink = domById('menu-link');
var submenu  = domById('submenu');
var showMenu = false;

/***********************************
 * GET DOCUMENT OBJECT MODEL BY ID *
 ***********************************/
function domById(id)
{
   return document.getElementById(id);
}

menuLink.onclick = function()
{
   showMenu = !showMenu;
   
   if (showMenu)
      submenu.style.display = 'block';
   else // !showMenu
      submenu.style.display = 'none';
}
