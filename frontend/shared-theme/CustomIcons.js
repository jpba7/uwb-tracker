import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';


export function SitemarkIcon() {
  const theme = useTheme();
  const color = theme.palette.mode === 'dark' ? '#fff' : '#000';

  return (
      <SvgIcon sx={{ height: 40, width: 40 }}>
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="5" fill="none" />
          <path d="M20 35 Q50 5, 80 35" stroke={color} strokeWidth="4" fill="none" />
          <path d="M25 38 Q50 12, 75 38" stroke={color} strokeWidth="3" fill="none" />
          <path d="M30 40 Q50 18, 70 40" stroke={color} strokeWidth="2.5" fill="none" />
          <circle cx="50" cy="50" r="7" fill={color} />
          <circle cx="50" cy="50" r="13" stroke={color} strokeWidth="2" fill="none" />
        </svg>
      </SvgIcon>
  );
}

export function SitemarkIconWithText() {
  const theme = useTheme();
  const color = theme.palette.mode === 'dark' ? '#fff' : '#000';

  return (
    <Box display="flex" alignItems="center">
      <SvgIcon sx={{ height: 40, width: 40 }}>
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="5" fill="none" />
          <path d="M20 35 Q50 5, 80 35" stroke={color} strokeWidth="4" fill="none" />
          <path d="M25 38 Q50 12, 75 38" stroke={color} strokeWidth="3" fill="none" />
          <path d="M30 40 Q50 18, 70 40" stroke={color} strokeWidth="2.5" fill="none" />
          <circle cx="50" cy="50" r="7" fill={color} />
          <circle cx="50" cy="50" r="13" stroke={color} strokeWidth="2" fill="none" />
        </svg>
      </SvgIcon>
      <Typography variant="h6" sx={{ marginLeft: 1, fontFamily: 'Roboto, sans-serif', color: color }}>
        Telescope
      </Typography>
    </Box>
  );
}



export function IndiaFlag() {
  return (
    <SvgIcon>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
        <g clipPath="url(#a)">
          <mask
            id="b"
            maskUnits="userSpaceOnUse"
            x="-4"
            y="0"
            width="32"
            height="24"
          >
            <path d="M-4 0h32v24H-4V0Z" fill="#fff" />
          </mask>
          <g mask="url(#b)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M-4 0v24h32V0H-4Z"
              fill="#F7FCFF"
            />
            <mask
              id="c"
              maskUnits="userSpaceOnUse"
              x="-4"
              y="0"
              width="32"
              height="24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M-4 0v24h32V0H-4Z"
                fill="#fff"
              />
            </mask>
            <g mask="url(#c)" fillRule="evenodd" clipRule="evenodd">
              <path d="M-4 0v8h32V0H-4Z" fill="#FF8C1A" />
              <path d="M-4 16v8h32v-8H-4Z" fill="#5EAA22" />
              <path
                d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Zm7 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                fill="#3D58DB"
              />
              <path
                d="m12 12.9-.6 3 .4-3-1.5 2.8 1.2-3L9.4 15l2-2.4-2.8 1.6 2.6-1.8-3 .7 3-1H8l3.2-.2-3-1 3 .8-2.6-1.9 2.8 1.7-2-2.5 2.1 2.3-1.2-3 1.5 2.9-.4-3.2.6 3.2.6-3.2-.4 3.2 1.5-2.8-1.2 2.9L14.6 9l-2 2.5 2.8-1.7-2.6 1.9 3-.8-3 1 3.2.1-3.2.1 3 1-3-.7 2.6 1.8-2.8-1.6 2 2.4-2.1-2.3 1.2 3-1.5-2.9.4 3.2-.6-3.1Z"
                fill="#3D58DB"
              />
            </g>
          </g>
        </g>
        <defs>
          <clipPath id="a">
            <rect width="24" height="24" rx="12" fill="#fff" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}

export function UsaFlag() {
  return (
    <SvgIcon>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_983_1725)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-4 0H28V24H-4V0Z"
            fill="#F7FCFF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-4 14.6667V16.6667H28V14.6667H-4Z"
            fill="#E31D1C"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-4 18.3333V20.3333H28V18.3333H-4Z"
            fill="#E31D1C"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-4 7.33325V9.33325H28V7.33325H-4Z"
            fill="#E31D1C"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-4 22V24H28V22H-4Z"
            fill="#E31D1C"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-4 11V13H28V11H-4Z"
            fill="#E31D1C"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-4 0V2H28V0H-4Z"
            fill="#E31D1C"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-4 3.66675V5.66675H28V3.66675H-4Z"
            fill="#E31D1C"
          />
          <path d="M-4 0H16V13H-4V0Z" fill="#2E42A5" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-2.27876 2.93871L-3.00465 3.44759L-2.75958 2.54198L-3.4043 1.96807H-2.56221L-2.27978 1.229L-1.94861 1.96807H-1.23075L-1.79479 2.54198L-1.57643 3.44759L-2.27876 2.93871ZM1.72124 2.93871L0.995357 3.44759L1.24042 2.54198L0.595707 1.96807H1.43779L1.72022 1.229L2.05139 1.96807H2.76925L2.20521 2.54198L2.42357 3.44759L1.72124 2.93871ZM4.99536 3.44759L5.72124 2.93871L6.42357 3.44759L6.20517 2.54198L6.76927 1.96807H6.05137L5.72022 1.229L5.43779 1.96807H4.59571L5.24042 2.54198L4.99536 3.44759ZM9.72127 2.93871L8.99537 3.44759L9.24047 2.54198L8.59567 1.96807H9.43777L9.72027 1.229L10.0514 1.96807H10.7693L10.2052 2.54198L10.4236 3.44759L9.72127 2.93871ZM-3.00465 7.44759L-2.27876 6.93871L-1.57643 7.44759L-1.79479 6.54198L-1.23075 5.96807H-1.94861L-2.27978 5.229L-2.56221 5.96807H-3.4043L-2.75958 6.54198L-3.00465 7.44759ZM1.72124 6.93871L0.995357 7.44759L1.24042 6.54198L0.595707 5.96807H1.43779L1.72022 5.229L2.05139 5.96807H2.76925L2.20521 6.54198L2.42357 7.44759L1.72124 6.93871ZM4.99536 7.44759L5.72124 6.93871L6.42357 7.44759L6.20517 6.54198L6.76927 5.96807H6.05137L5.72022 5.229L5.43779 5.96807H4.59571L5.24042 6.54198L4.99536 7.44759ZM9.72127 6.93871L8.99537 7.44759L9.24047 6.54198L8.59567 5.96807H9.43777L9.72027 5.229L10.0514 5.96807H10.7693L10.2052 6.54198L10.4236 7.44759L9.72127 6.93871ZM-3.00465 11.4476L-2.27876 10.9387L-1.57643 11.4476L-1.79479 10.542L-1.23075 9.96807H-1.94861L-2.27978 9.229L-2.56221 9.96807H-3.4043L-2.75958 10.542L-3.00465 11.4476ZM1.72124 10.9387L0.995357 11.4476L1.24042 10.542L0.595707 9.96807H1.43779L1.72022 9.229L2.05139 9.96807H2.76925L2.20521 10.542L2.42357 11.4476L1.72124 10.9387ZM4.99536 11.4476L5.72124 10.9387L6.42357 11.4476L6.20517 10.542L6.76927 9.96807H6.05137L5.72022 9.229L5.43779 9.96807H4.59571L5.24042 10.542L4.99536 11.4476ZM9.72127 10.9387L8.99537 11.4476L9.24047 10.542L8.59567 9.96807H9.43777L9.72027 9.229L10.0514 9.96807H10.7693L10.2052 10.542L10.4236 11.4476L9.72127 10.9387ZM12.9954 3.44759L13.7213 2.93871L14.4236 3.44759L14.2052 2.54198L14.7693 1.96807H14.0514L13.7203 1.229L13.4378 1.96807H12.5957L13.2405 2.54198L12.9954 3.44759ZM13.7213 6.93871L12.9954 7.44759L13.2405 6.54198L12.5957 5.96807H13.4378L13.7203 5.229L14.0514 5.96807H14.7693L14.2052 6.54198L14.4236 7.44759L13.7213 6.93871ZM12.9954 11.4476L13.7213 10.9387L14.4236 11.4476L14.2052 10.542L14.7693 9.96807H14.0514L13.7203 9.229L13.4378 9.96807H12.5957L13.2405 10.542L12.9954 11.4476ZM-0.278763 4.93871L-1.00464 5.44759L-0.759583 4.54198L-1.40429 3.96807H-0.562213L-0.279783 3.229L0.0513873 3.96807H0.769247L0.205207 4.54198L0.423567 5.44759L-0.278763 4.93871ZM2.99536 5.44759L3.72124 4.93871L4.42357 5.44759L4.20521 4.54198L4.76925 3.96807H4.05139L3.72022 3.229L3.43779 3.96807H2.59571L3.24042 4.54198L2.99536 5.44759ZM7.72127 4.93871L6.99537 5.44759L7.24047 4.54198L6.59567 3.96807H7.43777L7.72027 3.229L8.05137 3.96807H8.76927L8.20517 4.54198L8.42357 5.44759L7.72127 4.93871ZM-1.00464 9.44759L-0.278763 8.93871L0.423567 9.44759L0.205207 8.54198L0.769247 7.96807H0.0513873L-0.279783 7.229L-0.562213 7.96807H-1.40429L-0.759583 8.54198L-1.00464 9.44759ZM3.72124 8.93871L2.99536 9.44759L3.24042 8.54198L2.59571 7.96807H3.43779L3.72022 7.229L4.05139 7.96807H4.76925L4.20521 8.54198L4.42357 9.44759L3.72124 8.93871ZM6.99537 9.44759L7.72127 8.93871L8.42357 9.44759L8.20517 8.54198L8.76927 7.96807H8.05137L7.72027 7.229L7.43777 7.96807H6.59567L7.24047 8.54198L6.99537 9.44759ZM11.7213 4.93871L10.9954 5.44759L11.2405 4.54198L10.5957 3.96807H11.4378L11.7203 3.229L12.0514 3.96807H12.7693L12.2052 4.54198L12.4236 5.44759L11.7213 4.93871ZM10.9954 9.44759L11.7213 8.93871L12.4236 9.44759L12.2052 8.54198L12.7693 7.96807H12.0514L11.7203 7.229L11.4378 7.96807H10.5957L11.2405 8.54198L10.9954 9.44759Z"
            fill="#F7FCFF"
          />
        </g>
        <defs>
          <clipPath id="clip0_983_1725">
            <rect width="24" height="24" rx="12" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}
export function BrazilFlag() {
  return (
    <SvgIcon>
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_983_1741)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-4 0.5V24.5H28V0.5H-4Z"
            fill="#009933"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.9265 4.20404L24.1283 12.7075L11.7605 20.6713L-0.191406 12.5427L11.9265 4.20404Z"
            fill="#FFD221"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.9265 4.20404L24.1283 12.7075L11.7605 20.6713L-0.191406 12.5427L11.9265 4.20404Z"
            fill="url(#paint0_linear_983_1741)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 17.7C14.7614 17.7 17 15.4614 17 12.7C17 9.93853 14.7614 7.69995 12 7.69995C9.2386 7.69995 7 9.93853 7 12.7C7 15.4614 9.2386 17.7 12 17.7Z"
            fill="#2E42A5"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.379 15.07L10.1556 15.1874L10.1983 14.9387L10.0176 14.7626L10.2673 14.7263L10.379 14.5L10.4907 14.7263L10.7404 14.7626L10.5597 14.9387L10.6024 15.1874L10.379 15.07Z"
            fill="#F7FCFF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.379 15.07L12.1556 15.1874L12.1983 14.9387L12.0176 14.7626L12.2673 14.7263L12.379 14.5L12.4907 14.7263L12.7404 14.7626L12.5597 14.9387L12.6024 15.1874L12.379 15.07Z"
            fill="#F7FCFF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.379 16.27L12.1556 16.3874L12.1983 16.1387L12.0176 15.9625L12.2673 15.9262L12.379 15.7L12.4907 15.9262L12.7404 15.9625L12.5597 16.1387L12.6024 16.3874L12.379 16.27Z"
            fill="#F7FCFF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.379 12.07L11.1556 12.1874L11.1983 11.9387L11.0176 11.7626L11.2673 11.7263L11.379 11.5L11.4907 11.7263L11.7404 11.7626L11.5597 11.9387L11.6024 12.1874L11.379 12.07Z"
            fill="#F7FCFF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.379 14.07L11.1556 14.1874L11.1983 13.9387L11.0176 13.7626L11.2673 13.7263L11.379 13.5L11.4907 13.7263L11.7404 13.7626L11.5597 13.9387L11.6024 14.1874L11.379 14.07Z"
            fill="#F7FCFF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.97859 13.07L9.75519 13.1874L9.79789 12.9387L9.61719 12.7626L9.86689 12.7263L9.97859 12.5L10.0903 12.7263L10.34 12.7626L10.1593 12.9387L10.2019 13.1874L9.97859 13.07Z"
            fill="#F7FCFF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.5783 13.87L8.3549 13.9875L8.3976 13.7388L8.2168 13.5626L8.4666 13.5263L8.5783 13.3L8.6899 13.5263L8.9397 13.5626L8.759 13.7388L8.8016 13.9875L8.5783 13.87Z"
            fill="#F7FCFF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.1798 10.47L12.9565 10.5875L12.9991 10.3387L12.8184 10.1626L13.0682 10.1263L13.1798 9.90002L13.2915 10.1263L13.5413 10.1626L13.3605 10.3387L13.4032 10.5875L13.1798 10.47Z"
            fill="#F7FCFF"
          />
          <path
            d="M7 12L7.5 10C11.6854 10.2946 14.6201 11.2147 17 13.5L16.5 15C14.4373 13.0193 10.7839 12.2664 7 12Z"
            fill="#F7FCFF"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_983_1741"
            x1="27.9997"
            y1="24.5"
            x2="27.9997"
            y2="0.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFC600" />
            <stop offset="1" stopColor="#FFDE42" />
          </linearGradient>
          <clipPath id="clip0_983_1741">
            <rect y="0.5" width="24" height="24" rx="12" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}

export function GlobeFlag() {
  return (
    <SvgIcon>
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_986_1789)">
          <circle cx="12" cy="12.5" r="12" fill="#007FFF" />
          <path
            d="M12 0.5C5.376 0.5 0 5.876 0 12.5C0 19.124 5.376 24.5 12 24.5C18.624 24.5 24 19.124 24 12.5C24 5.876 18.624 0.5 12 0.5ZM10.8 22.016C6.06 21.428 2.4 17.396 2.4 12.5C2.4 11.756 2.496 11.048 2.652 10.352L8.4 16.1V17.3C8.4 18.62 9.48 19.7 10.8 19.7V22.016ZM19.08 18.968C18.768 17.996 17.88 17.3 16.8 17.3H15.6V13.7C15.6 13.04 15.06 12.5 14.4 12.5H7.2V10.1H9.6C10.26 10.1 10.8 9.56 10.8 8.9V6.5H13.2C14.52 6.5 15.6 5.42 15.6 4.1V3.608C19.116 5.036 21.6 8.48 21.6 12.5C21.6 14.996 20.64 17.264 19.08 18.968Z"
            fill="#3EE07F"
          />
        </g>
        <defs>
          <clipPath id="clip0_986_1789">
            <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}