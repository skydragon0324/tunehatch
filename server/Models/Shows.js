export const returnShowWithPerformersStatement = `RETURN MERGE(show, {performers: (
    FOR perf IN performances
    FILTER perf.status == "accepted" && perf._to == CONCAT("shows/", show._key)
    RETURN {
      uid: perf.uid ? perf.uid : perf.id,
      id: perf.id,
      showID: perf.showID,
      type: perf.type,
      status: perf.status,
      timestamp: perf.timestamp
    }
  )},
  {applications: (
    FOR perf IN performances
    FILTER perf.status == "pending" && perf.type == "application" && perf._to == CONCAT("shows/", show._key)
    RETURN {
      uid: perf.uid ? perf.uid : perf.id,
      id: perf.id,
      showID: perf.showID,
      type: perf.type,
      status: perf.status,
      timestamp: perf.timestamp
    }
  )},
  {invites: (
    FOR perf IN performances
    FILTER perf.status == "pending" && perf.type == "invite" && perf._to == CONCAT("shows/", show._key)
    RETURN {
      uid: perf.uid ? perf.uid : perf.id,
      id: perf.id,
      showID: perf.showID,
      type: perf.type,
      status: perf.status,
      timestamp: perf.timestamp
    }
  )})`

  export const returnPerformersString = `{performers: (
    FOR perf IN performances
    FILTER perf.status == "accepted" && perf._to == CONCAT("shows/", show._key)
    RETURN {
      uid: perf.uid ? perf.uid : perf.id,
      id: perf.id,
      showID: perf.showID,
      type: perf.type,
      status: perf.status,
      timestamp: perf.timestamp
    }
  )},
  {applications: (
    FOR perf IN performances
    FILTER perf.status == "pending" && perf.type == "application" && perf._to == CONCAT("shows/", show._key)
    RETURN {
      uid: perf.uid ? perf.uid : perf.id,
      id: perf.id,
      showID: perf.showID,
      type: perf.type,
      status: perf.status,
      timestamp: perf.timestamp
    }
  )},
  {invites: (
    FOR perf IN performances
    FILTER perf.status == "pending" && perf.type == "invite" && perf._to == CONCAT("shows/", show._key)
    RETURN {
      uid: perf.uid ? perf.uid : perf.id,
      id: perf.id,
      showID: perf.showID,
      type: perf.type,
      status: perf.status,
      timestamp: perf.timestamp
    }
  )}`