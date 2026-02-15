<template>
  <nav class="app-navigation">
    <svg
      class="app-navigation__path"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 396 1080"
      fill="none"
    >
      <path
        id="TravelPath"
        d="M88.646 80.105C188.722 556.720 -9.589 549.720 88.646 999.470"
        stroke="#E6E8EF"
        stroke-width="3"
        stroke-dasharray="10 10"
        fill="none"
        ref="path"
      />

      <a
        href="#"
        v-for="(project, index) in appStore.state.projects"
        :key="index"
        @click.prevent="() => {
          project.navigationOnClick();
        }"
      >
        <component
          :is="project.navigationSvg.component"
          v-bind="actions.calculateSvgPosition(project.navigationSvg, index / (appStore.state.projects.length - 1))"
          :data-index="index"
          :data-percent="index / (appStore.state.projects.length - 1)"
        />

        <rect
          v-bind="actions.placeOnPathAt(index / (appStore.state.projects.length - 1), project.navigationSvg.width / 2 + 16, 1)"
          width="16"
          height="2"
          fill="#4F7CFF"
        />

        <text
          v-bind="actions.placeOnPathAt(index / (appStore.state.projects.length - 1), project.navigationSvg.width / 2 + 48, 8)"
          fill="#E6E8EF"
          font-size="16"
          font-family="Space Grotesk, Arial, sans-serif"
          font-weight="600"
        >{{ project.name[locale] }}</text>
      </a>

      <path
        v-for="(traj, index) in trajectories"
        :key="index"
        :d="actions.createTrajectoryBetweenFollowingPlanets(
          actions.getPlanetElementFromIndex(traj.from),
          actions.getPlanetElementFromIndex(traj.to),
          { [traj.type]: true }
        )"
        :id="traj.type === 'prev'
          ? `PrevTrajectory${traj.to}${traj.from}`
          : `NextTrajectory${traj.from}${traj.to}`
        "
        :stroke="appStore.state.settings.showTrajectories ? traj.stroke : 'none'"
        stroke-width="2"
        stroke-dasharray="10 30"
      >
        <animate
          v-if="appStore.state.settings.showTrajectories"
          attributeName="stroke-dashoffset"
          values="40;0"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>

      <g id="Rocket" :transform="actions.placeRocketOnPlanet(appStore.state.oldIndex)">
        <path d="M29.9568 6.30471C29.937 6.20601 29.863 6.12702 29.7643 6.10231C26.5787 5.28916 19.1758 7.99733 15.1411 11.953C14.421 12.6533 13.7651 13.413 13.1782 14.2269C11.947 14.1054 10.7135 14.1838 9.65769 14.6324C6.68031 15.9066 5.78622 19.3036 5.53275 20.7616C5.48106 21.0453 5.67116 21.3193 5.95739 21.3737C6.00427 21.3811 6.05362 21.3861 6.10296 21.3812L10.8694 20.9047C10.8696 21.2649 10.887 21.6226 10.9242 21.9804C10.9465 22.2296 11.0552 22.4616 11.228 22.6393L13.0546 24.4955C13.2273 24.6732 13.4593 24.7868 13.706 24.8116C14.0613 24.8561 14.4166 24.881 14.7744 24.8885L14.2066 29.6377C14.1746 29.9263 14.3771 30.188 14.6682 30.2226C14.7176 30.2276 14.7644 30.2251 14.8138 30.2202C16.2768 30.0013 19.696 29.1738 21.0196 26.2212C21.4879 25.1753 21.5934 23.9491 21.4966 22.7228C22.3254 22.1508 23.0998 21.5097 23.815 20.8044C27.8619 16.8463 30.696 9.66294 29.9568 6.30471ZM19.8603 15.9964C18.8483 14.9647 18.8623 13.3067 19.8932 12.2956C20.924 11.2845 22.582 11.3 23.5941 12.3318C24.6061 13.3635 24.592 15.0215 23.5612 16.0326C22.5303 17.0437 20.8773 17.0282 19.8652 15.9964C19.8603 15.9964 19.8603 15.9964 19.8603 15.9964Z" fill="url(#rocketGradient)"/>
        <path id="RocketTrust" opacity="0" d="M12.5347 25.8222C12.2338 26.1181 11.7527 26.2289 11.1754 26.3224C9.87777 26.5291 8.74234 25.3986 8.98848 24.091C9.08201 23.5976 9.35309 22.902 9.51586 22.7392C9.61204 22.648 9.61444 22.4975 9.52311 22.4012C9.46881 22.3469 9.39724 22.3197 9.32323 22.3296C8.5979 22.4131 7.91956 22.7311 7.3992 23.2416C6.10447 24.5116 5.9413 29.2709 5.9413 29.2709C5.9413 29.2709 10.7055 29.1965 11.9978 27.9289C12.5181 27.4184 12.8558 26.745 12.9493 26.0197C12.9714 25.8001 12.695 25.6619 12.5347 25.8222Z" fill="url(#rocketTrailGradient)"/>
      </g>

      <a href="#" @click.prevent.stop="achievementsStore.actions.acquireByProject('Portfolio', 'voyager_one')">
        <g id="VoyagerOne" transform="translate(21 1002)">
          <path d="M4.49561 3.25001H4.12939L3.96272 3.00002H3.68752C3.68752 3.00006 3.68752 3.00009 3.68752 3.00014C3.68752 3.02394 3.69436 3.048 3.70852 3.06936L3.82894 3.25001H3.8125C3.74341 3.25001 3.6875 3.30592 3.6875 3.37501C3.6875 3.44411 3.74341 3.50001 3.8125 3.50001H4.1875V3.65873C4.2243 3.63742 4.26691 3.62501 4.3125 3.62501C4.35809 3.62501 4.4007 3.63742 4.4375 3.65873V3.50001H4.8125C4.88159 3.50001 4.9375 3.44411 4.9375 3.37501C4.9375 3.30592 4.88159 3.25001 4.8125 3.25001H4.79606L4.9165 3.06934C4.93072 3.04797 4.9375 3.02384 4.9375 3H4.66226L4.49561 3.25001Z" fill="#B6B8BE"/>
          <path d="M5.18749 1.37501H5.13573L5.27587 1.51515C5.34667 1.58594 5.44092 1.62501 5.54101 1.62501H5.81249V1.37501H5.54101C5.50817 1.37501 5.47595 1.36169 5.45263 1.33838L5.31249 1.19824V1.25001C5.31249 1.3191 5.25659 1.37501 5.18749 1.37501Z" fill="#888693"/>
          <path d="M6.31249 1.625C6.40475 1.625 6.48533 1.57459 6.52864 1.5H6.43749C6.3684 1.5 6.31249 1.44409 6.31249 1.375H6.06249V1.625H6.31249Z" fill="#888693"/>
          <path d="M3.08191 1.084C3.12677 1.10214 3.16322 1.13203 3.18975 1.1685C3.21308 1.14141 3.24713 1.125 3.2843 1.125H3.3125V0.875H3.2843C3.14636 0.875 3.02241 0.949406 2.95674 1.06786C2.99783 1.06261 3.04077 1.06737 3.08191 1.084Z" fill="#5C546A"/>
          <path d="M2.91533 1.07678C2.89758 1.07191 2.87853 1.07077 2.85925 1.07441L1.92612 1.25006H1.93751C2.06024 1.25006 2.16241 1.33911 2.18337 1.45592L2.70125 1.35844L2.75636 1.22212C2.78578 1.14934 2.84564 1.09805 2.91533 1.07678Z" fill="#5C546A"/>
          <path d="M3.9375 0.624998H3.98927L4.3125 0.301749L4.63575 0.624998H4.68751H5.06251V0.125C5.06251 0.055906 5.00661 0 4.93751 0C4.86842 0 4.81251 0.055906 4.81251 0.125V0.448248L4.40087 0.0366249C4.35205 -0.0122031 4.27294 -0.0122031 4.22411 0.0366249L3.81248 0.448248V0.125C3.81248 0.055906 3.75658 0 3.68749 0C3.61839 0 3.56249 0.055906 3.56249 0.125V0.624998L3.9375 0.624998Z" fill="#888693"/>
          <path d="M3.8125 1.625V1.375H3.5625V1.625H3.8125Z" fill="#888693"/>
          <path d="M5.0625 1.625V1.375H4.8125V1.625H5.0625Z" fill="#888693"/>
          <path d="M4.6875 0.625V1.375H4.8125H5.06249H5.13574H5.18751C5.2566 1.375 5.31251 1.31909 5.31251 1.25V1.19823V0.75C5.31251 0.680906 5.2566 0.625 5.18751 0.625H5.06251L4.6875 0.625Z" fill="#FFCF00"/>
          <path d="M4.6875 0.625H4.63575L3.98926 0.625H3.9375V1.375H4.6875V0.625Z" fill="#FF9300"/>
          <path d="M3.3125 1.25C3.3125 1.31909 3.36841 1.375 3.4375 1.375H3.5625H3.8125H3.9375V0.625H3.5625L3.4375 0.625C3.36841 0.625 3.3125 0.680906 3.3125 0.75V0.874999V1.125V1.25Z" fill="#FF7400"/>
          <path d="M3.8125 1.625H3.5625C3.42469 1.625 3.3125 1.73719 3.3125 1.875V2.07325L3.34913 2.03662C3.37256 2.01319 3.4043 2 3.4375 2L5.18749 2C5.2207 2 5.25243 2.01319 5.27587 2.03662L5.31249 2.07325V1.875C5.31249 1.73719 5.20031 1.625 5.0625 1.625H4.8125L3.8125 1.625Z" fill="#B6B8BE"/>
          <path d="M5.18749 2L3.4375 2C3.4043 2 3.37256 2.01319 3.34913 2.03662L3.3125 2.07325L2.59913 2.78662C2.57521 2.81054 2.5625 2.84253 2.5625 2.875C2.5625 2.89111 2.56555 2.90734 2.57202 2.92286C2.5913 2.96961 2.63696 3 2.6875 3L3.6875 3H3.96272H4.66226H4.93751H5.93751C5.98804 3 6.03369 2.96961 6.05299 2.92286C6.07252 2.87623 6.06166 2.82239 6.0259 2.78662L5.31253 2.07325L5.2759 2.03662C5.25243 2.01319 5.2207 2 5.18749 2Z" fill="#888693"/>
          <path d="M4.1875 3.65872C4.11284 3.70197 4.0625 3.78252 4.0625 3.875C4.0625 4.01308 4.17442 4.125 4.3125 4.125C4.45057 4.125 4.5625 4.01308 4.5625 3.875C4.5625 3.78252 4.51215 3.70197 4.4375 3.65872C4.4007 3.63741 4.35809 3.625 4.3125 3.625C4.2669 3.625 4.22429 3.63739 4.1875 3.65872Z" fill="#E3E6E9"/>
          <path d="M0.554091 7.92004L2.84407 1.99787C2.80297 2.00312 2.76002 1.99836 2.71888 1.98173C2.67552 1.96422 2.63982 1.93587 2.61349 1.90112L0.320935 7.82996C0.315201 7.84473 0.312514 7.85999 0.312514 7.87501C0.312514 7.92518 0.342904 7.97241 0.392467 7.99158C0.45681 8.01646 0.529185 7.98449 0.554091 7.92004Z" fill="#FF9300"/>
          <path d="M2.71888 1.98181C2.76002 1.99843 2.80297 2.0032 2.84407 1.99795C2.93086 1.98685 3.00932 1.9306 3.04444 1.84374L3.21997 1.40954C3.25335 1.32659 3.23888 1.23612 3.18975 1.16859C3.16322 1.13212 3.12677 1.10225 3.08191 1.08409C3.04077 1.06747 2.99783 1.0627 2.95674 1.06795C2.94266 1.06975 2.92882 1.0727 2.91533 1.07681C2.84564 1.09807 2.78579 1.14937 2.75636 1.22215L2.70125 1.35846L2.58083 1.65635C2.56851 1.68706 2.56252 1.71873 2.56252 1.74998C2.56252 1.80479 2.58074 1.85795 2.61351 1.90118C2.63982 1.93595 2.67552 1.96429 2.71888 1.98181Z" fill="#888693"/>
          <path d="M1.93751 1.25H1.92612L0.937511 1.25V1.625L2.18751 1.625V1.5C2.18751 1.48492 2.18593 1.47022 2.18337 1.45586C2.16243 1.33905 2.06024 1.25 1.93751 1.25Z" fill="#888693"/>
          <path d="M6.43749 1.5H6.52865H6.93749V0.875L6.43749 0.875C6.3684 0.875 6.31249 0.930906 6.31249 1V1.375C6.31249 1.44409 6.3684 1.5 6.43749 1.5Z" fill="#FF9300"/>
          <path d="M5.81249 1.875C5.81249 1.94409 5.8684 2 5.93749 2C6.00658 2 6.06249 1.94409 6.06249 1.875V1.625V1.375V1C6.06249 0.930906 6.00658 0.875 5.93749 0.875C5.8684 0.875 5.81249 0.930906 5.81249 1V1.375V1.625V1.875Z" fill="#FF9300"/>
          <path d="M0.937511 2L1.93751 2C2.07532 2 2.18751 1.88781 2.18751 1.75V1.625L0.937511 1.625V2Z" fill="#B6B8BE"/>
          <path d="M0.937511 1.25C0.937511 1.18091 0.881605 1.125 0.812512 1.125C0.743418 1.125 0.687512 1.18091 0.687512 1.25L0.687512 2C0.687512 2.06909 0.743418 2.125 0.812512 2.125C0.881605 2.125 0.937511 2.06909 0.937511 2V1.625L0.937511 1.25Z" fill="#5C546A"/>
          <path d="M6.93749 1.75C6.93749 1.88781 7.04967 1.99999 7.18749 1.99999H7.43749C7.5753 1.99999 7.68748 1.88781 7.68748 1.75V0.749999C7.68748 0.612187 7.5753 0.5 7.43749 0.5L7.18749 0.5C7.04967 0.5 6.93749 0.612187 6.93749 0.749999V0.874999V1.5V1.75Z" fill="#FFCF00"/>
        </g>
      </a>

      <a href="#" @click.prevent.stop="achievementsStore.actions.acquireByProject('Portfolio', '3i_atlas')">
        <g id="3I-Atlas" transform="translate(220 166)">
          <path d="M8.02033 2.61735L1.5457 15.1295L1.53579 18.4732L4.87953 18.4831L8.02033 2.61735Z" fill="#62BBC7"/>
          <path d="M17.4298 12.0828L1.5457 15.1295L1.53579 18.4732L4.87952 18.4832L17.4298 12.0828Z" fill="#62BBC7"/>
          <path d="M12.4578 2.63051L1.5457 15.1295L1.53579 18.4732L4.87952 18.4831L12.4578 2.63051Z" fill="#6DD1DE"/>
          <path d="M17.443 7.64533L4.87952 18.4831L1.53578 18.4732L1.5457 15.1295L17.443 7.64533Z" fill="#6DD1DE"/>
          <path d="M19.4324 0.68242L1.54569 15.1295L1.53578 18.4732L4.87952 18.4831L19.4324 0.68242Z" fill="#7DF0FF"/>
          <path d="M10.4684 9.59342L1.5457 15.1295L1.53579 18.4732L4.87953 18.4831L10.4684 9.59342Z" fill="#C2F8FF"/>
          <path d="M3.00184 19.3839C4.31351 19.3877 5.37998 18.3276 5.38387 17.0159C5.38776 15.7042 4.32759 14.6378 3.01592 14.6339C1.70425 14.63 0.637778 15.6902 0.633889 17.0018C0.63 18.3135 1.69017 19.38 3.00184 19.3839Z" fill="#7DF0FF"/>
          <path d="M3.00267 19.1025C4.15901 19.1059 5.09919 18.1713 5.10262 17.015C5.10604 15.8586 4.17142 14.9184 3.01508 14.915C1.85874 14.9116 0.918562 15.8462 0.915134 17.0026C0.911705 18.1589 1.84633 19.0991 3.00267 19.1025Z" fill="#5995C1"/>
          <path d="M2.94915 16.0711C3.20804 16.0719 3.41852 15.8626 3.41929 15.6037C3.42006 15.3448 3.21082 15.1344 2.95193 15.1336C2.69305 15.1328 2.48256 15.3421 2.4818 15.601C2.48103 15.8598 2.69027 16.0703 2.94915 16.0711Z" fill="#4B7EA3"/>
          <path d="M2.91846 15.8836C3.12557 15.8842 3.29396 15.7168 3.29457 15.5097C3.29518 15.3026 3.12779 15.1342 2.92068 15.1336C2.71358 15.1329 2.54519 15.3003 2.54457 15.5074C2.54396 15.7145 2.71135 15.8829 2.91846 15.8836Z" fill="#5995C1"/>
          <path d="M4.44703 16.7944C4.61962 16.7949 4.75994 16.6554 4.76045 16.4828C4.76097 16.3102 4.62147 16.1699 4.44888 16.1694C4.27629 16.1689 4.13597 16.3084 4.13546 16.481C4.13495 16.6535 4.27444 16.7939 4.44703 16.7944Z" fill="#4B7EA3"/>
          <path d="M4.41615 16.6692C4.55422 16.6696 4.66648 16.558 4.66689 16.4199C4.6673 16.2819 4.5557 16.1696 4.41763 16.1692C4.27956 16.1688 4.1673 16.2804 4.16689 16.4185C4.16648 16.5565 4.27808 16.6688 4.41615 16.6692Z" fill="#5995C1"/>
          <path d="M3.65966 18.8545C3.91855 18.8553 4.12903 18.6461 4.1298 18.3872C4.13057 18.1283 3.92133 17.9178 3.66244 17.917C3.40356 17.9163 3.19307 18.1255 3.19231 18.3844C3.19154 18.6433 3.40078 18.8538 3.65966 18.8545Z" fill="#4B7EA3"/>
          <path d="M3.66022 18.667C3.86733 18.6676 4.03572 18.5002 4.03633 18.2931C4.03694 18.086 3.86955 17.9176 3.66244 17.917C3.45534 17.9164 3.28695 18.0838 3.28633 18.2909C3.28572 18.498 3.45311 18.6664 3.66022 18.667Z" fill="#5995C1"/>
          <path d="M1.4781 16.848C1.65068 16.8485 1.79101 16.709 1.79152 16.5364C1.79203 16.3638 1.65254 16.2235 1.47995 16.223C1.30736 16.2225 1.16704 16.362 1.16652 16.5345C1.16601 16.7071 1.30551 16.8475 1.4781 16.848Z" fill="#4B7EA3"/>
          <path d="M1.44722 16.7229C1.58529 16.7233 1.69755 16.6117 1.69796 16.4736C1.69837 16.3356 1.58677 16.2233 1.4487 16.2229C1.31063 16.2225 1.19837 16.3341 1.19796 16.4722C1.19755 16.6102 1.30915 16.7225 1.44722 16.7229Z" fill="#5995C1"/>
          <path d="M2.47365 18.3509C2.90512 18.3522 3.25593 18.0035 3.25721 17.572C3.25849 17.1405 2.90975 16.7897 2.47828 16.7884C2.04681 16.7872 1.696 17.1359 1.69472 17.5674C1.69344 17.9988 2.04218 18.3497 2.47365 18.3509Z" fill="#4B7EA3"/>
          <path d="M2.41208 18.0383C2.75725 18.0394 3.03791 17.7604 3.03893 17.4152C3.03995 17.07 2.76096 16.7894 2.41578 16.7884C2.07061 16.7873 1.78996 17.0663 1.78893 17.4115C1.78791 17.7567 2.0669 18.0373 2.41208 18.0383Z" fill="#5995C1"/>
          <path d="M3.41622 10.21L4.05874 9.57124L4.69778 10.2138L4.05526 10.8525L3.41622 10.21Z" fill="#C2F8FF"/>
          <path d="M9.21713 7.59594L9.85965 6.95722L10.4984 7.59943L9.85616 8.23847L9.21713 7.59594Z" fill="#C2F8FF"/>
          <path d="M8.77381 4.07612L9.41633 3.43708L10.0554 4.0796L9.41285 4.71864L8.77381 4.07612Z" fill="#C2F8FF"/>
          <path d="M15.7612 6.33191L16.4041 5.69318L17.0428 6.33571L16.4003 6.97474L15.7612 6.33191Z" fill="#C2F8FF"/>
          <path d="M13.8063 11.5854L14.4488 10.9467L15.0875 11.5892L14.445 12.228L13.8063 11.5854Z" fill="#C2F8FF"/>
          <path d="M6.35214 9.38152L6.66243 9.07306L6.97089 9.38335L6.6606 9.69181L6.35214 9.38152Z" fill="#C2F8FF"/>
          <path d="M5.70862 7.61516L6.0186 7.3067L6.32705 7.61699L6.01676 7.92545L5.70862 7.61516Z" fill="#C2F8FF"/>
          <path d="M10.9226 12.0657L11.2329 11.7573L11.5414 12.0679L11.2311 12.3763L10.9226 12.0657Z" fill="#C2F8FF"/>
          <path d="M9.71409 14.8393L10.0244 14.5308L10.3328 14.8411L10.0226 15.1496L9.71409 14.8393Z" fill="#C2F8FF"/>
          <path d="M12.6197 13.5766L12.9303 13.2681L13.2388 13.5787L12.9282 13.8872L12.6197 13.5766Z" fill="#C2F8FF"/>
          <path d="M14.4543 7.83232L14.7646 7.52387L15.073 7.83447L14.7627 8.14293L14.4543 7.83232Z" fill="#C2F8FF"/>
          <path d="M16.702 9.42815L17.0123 9.11969L17.3208 9.42998L17.0105 9.73844L16.702 9.42815Z" fill="#C2F8FF"/>
          <path d="M13.2731 3.48418L13.5834 3.17572L13.8918 3.48601L13.5815 3.79447L13.2731 3.48418Z" fill="#C2F8FF"/>
          <path d="M14.1506 1.17925L14.4608 0.87079L14.7693 1.18108L14.459 1.48954L14.1506 1.17925Z" fill="#C2F8FF"/>
          <path d="M10.6441 2.62419L10.9544 2.31574L11.2628 2.62603L10.9525 2.93448L10.6441 2.62419Z" fill="#C2F8FF"/>
        </g>
      </a>

      <defs>
        <linearGradient id="rocketGradient" gradientTransform="rotate(-45)">
          <stop stop-color="#FF3C3C"/>
          <stop offset="0.1" stop-color="#FF3C3C"/>
          <stop offset="0.1" stop-color="white"/>
          <stop offset="0.4" stop-color="white"/>
          <stop offset="0.4" stop-color="#FF3C3C"/>
          <stop offset="1" stop-color="#FF3C3C"/>
        </linearGradient>

        <linearGradient id="rocketTrailGradient" gradientTransform="rotate(135)">
          <stop offset="1" stop-color="#FF6A3C"/>
          <stop offset="0.6" stop-color="#FFC72C"/>
          <stop stop-color="white"/>
        </linearGradient>
      </defs>
    </svg>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { gsap } from 'gsap';

import { appStore } from '@/core/stores/appStore';
import type { ISVGPlanet } from '@/components/Svg';
import { achievementsStore } from '@/core/entities/achievement/store';

type Trajectory = {
  type: 'prev' | 'next';
  from: number;
  to: number;
  stroke: string;
};

defineOptions({ name: 'AppNavigation' });

const { locale } = useI18n();

const path = ref<SVGPathElement | null>(null);

const trajectories = computed(() => {
  const result: Array<Trajectory> = [];

  const current = appStore.state.currentIndex;
  const old = appStore.state.oldIndex;
  const max = appStore.state.projects.length - 1;

  if (current === undefined) return result;

  if (old !== undefined && old !== current) {
    const isForward = current > old;
    result.push({
      type: isForward ? 'next' : 'prev',
      from: isForward ? old : current,
      to: isForward ? current : old,
      stroke: isForward ? 'white' : 'lime',
    });
  }

  result.push(
    ...Array.from<never, Trajectory>({ length: current }, (_, i) => ({
      type: 'prev',
      from: i,
      to: current,
      stroke: 'lime',
    })),
    ...Array.from<never, Trajectory>({ length: max - current }, (_, i) => ({
      type: 'next',
      from: current,
      to: current + i + 1,
      stroke: 'white',
    })),
  );

  return result;
});

const actions = {
  calculateSvgPosition({ width, height }: ISVGPlanet, percent: number) {
    if (!path.value) return '';

    const pathLength = path.value.getTotalLength();
    const point = path.value.getPointAtLength(pathLength * percent);

    const translateX = point.x - width / 2;
    const translateY = point.y - height / 2;

    return {
      transform: `translate(${translateX}, ${translateY})`,
    };
  },
  placeOnPathAt(percent: number, offsetX = 0, offsetY = 0) {
    if (!path.value) return { x: 0, y: 0 };

    const pathLength = path.value.getTotalLength();
    const point = path.value.getPointAtLength(pathLength * percent);

    return {
      x: point.x + offsetX,
      y: point.y + offsetY,
    };
  },
  placeRocketOnPlanet(index: number) {
    const sanityzedIndex = Math.min(appStore.state.projects.length - 1, Math.max(0, index - 1));
    const planet = actions.getPlanetElementFromIndex(sanityzedIndex);
    if (!planet) return 'translate(0, 0)';

    const landingPoint = actions.getRocketLandingPointFor(planet);

    return `translate(${landingPoint.x - 16}, ${landingPoint.y - 16})`;
  },
  getPlanetElementFromIndex(index: number) {
    const sanityzedIndex = Math.min(appStore.state.projects.length - 1, Math.max(0, index));

    return document.querySelector(`g[data-index="${sanityzedIndex}"]`)! as SVGPathElement;
  },
  getRocketLandingPointFor(planet: SVGPathElement) {
    if (!path.value) return { x: 0, y: 0 };

    const planetPercent = parseFloat(planet.dataset.percent || '0');
    const planetIndex = parseInt(planet.dataset.index || '0', 10);
    const { width, height } = appStore.state.projects[planetIndex].navigationSvg;

    const widthOffsetPlanet1 = Math.cos(Math.PI / 4) * (width / 2) + 8;
    const heightOffsetPlanet1 = Math.sin(Math.PI / 4) * (height / 2) + 8;

    return actions.placeOnPathAt(planetPercent, widthOffsetPlanet1, -heightOffsetPlanet1);
  },
  createTrajectoryBetweenFollowingPlanets(
    planet1: SVGPathElement,
    planet2: SVGPathElement,
    options: { next?: boolean, prev?: boolean } = { next: false, prev: false },
  ) {
    if (!path.value || !planet1 || !planet2) return '';

    const planet1Percent = parseFloat(planet1.dataset.percent || '0');
    const planet2Percent = parseFloat(planet2.dataset.percent || '0');

    const rocketLandingPointPlanet1 = actions.getRocketLandingPointFor(planet1);
    const rocketLandingPointPlanet2 = actions.getRocketLandingPointFor(planet2);
    const middlePoint = actions.placeOnPathAt(planet2Percent - 0.125);
    const multiplier = ((planet2Percent + planet1Percent) / 2) / 0.125;

    // Next trajectory control points
    const nextPlanet1RocketLandingCtrlPoint1 = {
      x: rocketLandingPointPlanet1.x + (80 * multiplier) - (multiplier - 1) * 60,
      y: Math.max(8, rocketLandingPointPlanet1.y - (80 * multiplier) + (multiplier - 1) * 60),
    };
    const nextPlanet1RocketLandingCtrlPoint2 = {
      x: Math.min(388, middlePoint.x + (140 * multiplier) - (multiplier - 1) * 100),
      y: middlePoint.y - 20,
    };
    const nextPlanet2RocketLandingCtrlPoint1 = {
      x: middlePoint.x - 120,
      y: middlePoint.y + 20,
    };
    const nextPlanet2RocketLandingCtrlPoint2 = {
      x: rocketLandingPointPlanet2.x - 80,
      y: rocketLandingPointPlanet2.y + 80,
    };

    // Prev trajectory control points
    const prevPlanet1RocketLandingCtrlPoint1 = {
      x: rocketLandingPointPlanet2.x + 120,
      y: rocketLandingPointPlanet2.y - 60,
    };
    const prevPlanet1RocketLandingCtrlPoint2 = {
      x: rocketLandingPointPlanet1.x - 120,
      y: rocketLandingPointPlanet1.y + 60,
    };

    if (options.next) {
      return `M${rocketLandingPointPlanet1.x} ${rocketLandingPointPlanet1.y}C${nextPlanet1RocketLandingCtrlPoint1.x} ${nextPlanet1RocketLandingCtrlPoint1.y} ${nextPlanet1RocketLandingCtrlPoint2.x} ${nextPlanet1RocketLandingCtrlPoint2.y} ${middlePoint.x} ${middlePoint.y}C${nextPlanet2RocketLandingCtrlPoint1.x} ${nextPlanet2RocketLandingCtrlPoint1.y} ${nextPlanet2RocketLandingCtrlPoint2.x} ${nextPlanet2RocketLandingCtrlPoint2.y} ${rocketLandingPointPlanet2.x} ${rocketLandingPointPlanet2.y}`;
    }

    if (options.prev) {
      return `M${rocketLandingPointPlanet2.x} ${rocketLandingPointPlanet2.y}C${prevPlanet1RocketLandingCtrlPoint1.x} ${prevPlanet1RocketLandingCtrlPoint1.y} ${prevPlanet1RocketLandingCtrlPoint2.x} ${prevPlanet1RocketLandingCtrlPoint2.y} ${rocketLandingPointPlanet1.x} ${rocketLandingPointPlanet1.y}`;
    }

    throw new Error('Invalid options for createTrajectoryBetweenFollowingPlanets');
  },
  animateRocket(trajectoryId: string) {
    gsap.to('#Rocket', {
      duration: 6,
      ease: 'power1.inOut',
      motionPath: {
        path: `#${trajectoryId}`,
        align: `#${trajectoryId}`,
        autoRotate: 45,
        alignOrigin: [0.5, 0.5],
      },
      onComplete() {
        document.querySelector('#RocketTrust')?.setAttributeNS(null, 'opacity', '0');
      },
      onStart() {
        document.querySelector('#RocketTrust')?.setAttributeNS(null, 'opacity', '1');
      },
    });
    gsap.to('#RocketTrust', {
      x: -2,
      scaleY: 1.5,
      scaleX: 1.5,
      transformOrigin: '50% 0%',
      repeat: -1,
      yoyo: true,
      duration: 0.3,
      ease: 'power1.inOut',
    });
  },
};

watch(() => appStore.state.currentIndex, (newIndex, oldIndex) => {
  if (oldIndex === undefined || newIndex === oldIndex) return;

  appStore.state.oldIndex = oldIndex;

  const isForward = newIndex > oldIndex;
  const trajectoryId = isForward
    ? `NextTrajectory${oldIndex}${newIndex}`
    : `PrevTrajectory${oldIndex}${newIndex}`
  ;

  actions.animateRocket(trajectoryId);
});
</script>

<style lang="scss" src="./Navigation.scss">
</style>
