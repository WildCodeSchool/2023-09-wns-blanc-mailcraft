import React, { useState } from 'react';

interface SideBarProps {
  onSelect: (form: string) => void;
}

const SideBar = ({ onSelect }: SideBarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="absolute bottom-0 left-0 mb-4 ml-4 md:hidden pb-1 text-black bg-rose-200 rounded-full w-8 h-8 flex items-center justify-center"
      >
        {isCollapsed ? '≡' : '×'}
      </button>
      <div className={`h-screen bg-white text-black w-2/5 sm:w-3/4 md:w-64 flex flex-col border-r-2 border-black font-semibold ${isCollapsed ? 'hidden' : 'block'} md:block`}>
        <nav className="flex-1 flex flex-col space-y-36 overflow-y-auto">
          <ul className="space-y-4 mt-8 mb-8">
            <li>
              <button
                onClick={() => onSelect('informations')}
                className="flex items-center w-full px-4 py-2 text-left bg-rose-100 hover:bg-rose-300"
              >
                <svg
                  className="h-7 w-7 mr-1"
                  fill="none"
                  stroke="black"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 9H18M13 11H16M10.5 9.5C10.5 10.3284 9.82843 11 9 11C8.17157 11 7.5 10.3284 7.5 9.5C7.5 8.67157 8.17157 8 9 8C9.82843 8 10.5 8.67157 10.5 9.5ZM7.65882 13H10.3412C10.5824 13 10.7031 13 10.811 13.0154C11.1844 13.0685 11.5074 13.2554 11.6883 13.523C11.7405 13.6003 11.7787 13.6922 11.855 13.8759C11.9467 14.0967 11.9925 14.2071 11.9987 14.2961C12.0206 14.6103 11.7659 14.8939 11.3878 14.9766C11.2806 15 11.1357 15 10.8458 15H7.15422C6.86432 15 6.71937 15 6.61221 14.9766C6.23409 14.8939 5.97944 14.6103 6.00131 14.2961C6.0075 14.2071 6.05334 14.0967 6.14502 13.8759C6.22131 13.6922 6.25945 13.6003 6.31173 13.523C6.49265 13.2554 6.81558 13.0685 7.18903 13.0154C7.29693 13 7.41756 13 7.65882 13ZM6 17H18C18.9428 17 19.4142 17 19.7071 16.7071C20 16.4142 20 15.9428 20 15V8C20 7.05719 20 6.58579 19.7071 6.29289C19.4142 6 18.9428 6 18 6H6C5.05719 6 4.58579 6 4.29289 6.29289C4 6.58579 4 7.05719 4 8V15C4 15.9428 4 16.4142 4.29289 16.7071C4.58579 17 5.05719 17 6 17Z"
                    stroke="#00000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Informations personnelles
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelect('links')}
                className="flex items-center w-full px-4 py-2 text-left bg-rose-100 hover:bg-rose-300"
              >
                <svg
                  className="h-7 w-7 mr-1"
                  fill="none"
                  stroke="black"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6.47214C3 6.16165 3.07229 5.85542 3.21115 5.57771L4 4H9L10 6H20C20.5523 6 21 6.44772 21 7V9V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V9V6.47214Z"
                    stroke="#000000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 20H20C20.5523 20 21 19.5523 21 19V11C21 9.89543 20.1046 9 19 9H5C3.89543 9 3 9.89543 3 11V19C3 19.5523 3.44772 20 4 20Z"
                    stroke="#000000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Mes liens
              </button>
            </li>
          </ul>
          <div className="flex flex-col items-center justify-center space-y-8">
            <button
              type="button"
              className="flex justify-center items-center gap-4 w-4/5 h-10 text-white text-sm md:text-base bg-[#E83B4E] hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-200 font-medium rounded-lg"
            >
              <svg
                className="hidden md:block shadow-xl h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="_42.Badge"
                  data-name="42.Badge"
                  d="M36.992,20.483V24.5l-3.485,2.011L31.5,30h-.511V45s0,.007,0,.011A.967.967,0,0,1,30,46l-.01,0a.978.978,0,0,1-.775-.4L23.987,40.38,18.762,45.6a.976.976,0,0,1-.775.4l-.01,0a.967.967,0,0,1-.988-.987s0-.007,0-.011V30h-.507l-2.012-3.482L10.985,24.5v-4.02L8.974,17l2.011-3.483V9.495l3.484-2.013L16.481,4h4.025l3.48-2.012L27.47,4h4.025L33.5,7.482,36.99,9.495v4.022L39,17ZM18.987,30V42.619l4.19-4.19a.942.942,0,0,1,.095-.144,1.05,1.05,0,0,1,1.43,0,1.023,1.023,0,0,1,.095.144l4.19,4.19V30H27.471l-3.484,2.013L20.507,30H18.986S18.987,30,18.987,30Zm16-15.948v-3.4l-2.948-1.7L30.34,6H26.934L23.989,4.3,21.046,6H17.64l-1.7,2.942-2.949,1.7v3.4L11.289,17l1.7,2.947v3.4l2.949,1.7,1.7,2.945h3.405l2.943,1.7,2.945-1.7h3.405l1.7-2.945,2.949-1.7v-3.4L36.686,17Z"
                  transform="translate(-8.974 -1.991)"
                  fill-rule="evenodd"
                />
              </svg>
              <p>Changer d'offre</p>
            </button>
            <button
              type="button"
              className="flex justify-center items-center gap-4 w-4/5 h-10 text-white text-md bg-[#E83B4E] hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-200 font-medium rounded-lg"
            >
              <svg
                className="hidden md:block shadow-xl h-6 w-6 me-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.75 9.874C11.75 10.2882 12.0858 10.624 12.5 10.624C12.9142 10.624 13.25 10.2882 13.25 9.874H11.75ZM13.25 4C13.25 3.58579 12.9142 3.25 12.5 3.25C12.0858 3.25 11.75 3.58579 11.75 4H13.25ZM9.81082 6.66156C10.1878 6.48991 10.3542 6.04515 10.1826 5.66818C10.0109 5.29121 9.56615 5.12478 9.18918 5.29644L9.81082 6.66156ZM5.5 12.16L4.7499 12.1561L4.75005 12.1687L5.5 12.16ZM12.5 19L12.5086 18.25C12.5029 18.25 12.4971 18.25 12.4914 18.25L12.5 19ZM19.5 12.16L20.2501 12.1687L20.25 12.1561L19.5 12.16ZM15.8108 5.29644C15.4338 5.12478 14.9891 5.29121 14.8174 5.66818C14.6458 6.04515 14.8122 6.48991 15.1892 6.66156L15.8108 5.29644ZM13.25 9.874V4H11.75V9.874H13.25ZM9.18918 5.29644C6.49843 6.52171 4.7655 9.19951 4.75001 12.1561L6.24999 12.1639C6.26242 9.79237 7.65246 7.6444 9.81082 6.66156L9.18918 5.29644ZM4.75005 12.1687C4.79935 16.4046 8.27278 19.7986 12.5086 19.75L12.4914 18.25C9.08384 18.2892 6.28961 15.5588 6.24995 12.1513L4.75005 12.1687ZM12.4914 19.75C16.7272 19.7986 20.2007 16.4046 20.2499 12.1687L18.7501 12.1513C18.7104 15.5588 15.9162 18.2892 12.5086 18.25L12.4914 19.75ZM20.25 12.1561C20.2345 9.19951 18.5016 6.52171 15.8108 5.29644L15.1892 6.66156C17.3475 7.6444 18.7376 9.79237 18.75 12.1639L20.25 12.1561Z"
                  fill="#FFFF"
                />
              </svg>
              Déconnexion
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default SideBar;
