// import React, { useMemo } from 'react';

// export default function GigLabel(props: any) {

//   const gigLabel = useMemo(() => {
//     if (!user.type?.artist?.enabled) {
//       return 'Apply';
//     }

//     if (props.performers.some((performer) => performer.uid === displayUID)) {
//       return <Button full inline>Performing</Button>;
//     }

//     if (props.applications.some((performer) => performer.uid === displayUID)) {
//       return <Button full inline>Applied</Button>;
//     }

//     if (props.invites.some((performer) => performer.uid === displayUID)) {
//       return <Button full inline>Invited</Button>;
//     }

//     return <Button full inline action={openSidebar({ status: true, component: "Apply", data: { showID: props.showID } })}>Apply</Button>;
//   }, [props.isGig, show.applications, show.performers, show.invites]);

//   return (

//   );
// }
