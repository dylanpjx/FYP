const SevenSegmentDisplay = ({commonAnode, sevenSegItems}) => {

  const result = sevenSegItems.filter(sevenSegItem => sevenSegItem.name === commonAnode.name)

  return (
    <ul className="SevenSegmentDisplay">
      {result.map(sevenSegItem => (
        <li key={sevenSegItem.name.concat(sevenSegItem.node)} id={sevenSegItem.node}>
          <label>{sevenSegItem.node}</label>
          {sevenSegItem.node === "CA" && !commonAnode.state && !sevenSegItem.state && sevenSegItem.name === commonAnode.name && <div className="CA_On"></div>}
          {((sevenSegItem.node === "CA" && !commonAnode.state && sevenSegItem.state && sevenSegItem.name === commonAnode.name) || (sevenSegItem.node === "CA" && commonAnode.state && sevenSegItem.name === commonAnode.name)) && <div className="CA_Off"></div>}
          {sevenSegItem.node === "CB" && !commonAnode.state && !sevenSegItem.state && sevenSegItem.name === commonAnode.name && <div className="CB_On"></div>}
          {((sevenSegItem.node === "CB" && !commonAnode.state && sevenSegItem.state && sevenSegItem.name === commonAnode.name) || (sevenSegItem.node === "CB" && commonAnode.state && sevenSegItem.name === commonAnode.name)) && <div className="CB_Off"></div>}
          {sevenSegItem.node === "CC" && !commonAnode.state && !sevenSegItem.state && sevenSegItem.name === commonAnode.name && <div className="CC_On"></div>}
          {((sevenSegItem.node === "CC" && !commonAnode.state && sevenSegItem.state && sevenSegItem.name === commonAnode.name) || (sevenSegItem.node === "CC" && commonAnode.state && sevenSegItem.name === commonAnode.name)) && <div className="CC_Off"></div>}
          {sevenSegItem.node === "CD" && !commonAnode.state && !sevenSegItem.state && sevenSegItem.name === commonAnode.name && <div className="CD_On"></div>}
          {((sevenSegItem.node === "CD" && !commonAnode.state && sevenSegItem.state && sevenSegItem.name === commonAnode.name) || (sevenSegItem.node === "CD" && commonAnode.state && sevenSegItem.name === commonAnode.name)) && <div className="CD_Off"></div>}
          {sevenSegItem.node === "CE" && !commonAnode.state && !sevenSegItem.state && sevenSegItem.name === commonAnode.name && <div className="CE_On"></div>}
          {((sevenSegItem.node === "CE" && !commonAnode.state && sevenSegItem.state && sevenSegItem.name === commonAnode.name) || (sevenSegItem.node === "CE" && commonAnode.state && sevenSegItem.name === commonAnode.name)) && <div className="CE_Off"></div>}
          {sevenSegItem.node === "CF" && !commonAnode.state && !sevenSegItem.state && sevenSegItem.name === commonAnode.name && <div className="CF_On"></div>}
          {((sevenSegItem.node === "CF" && !commonAnode.state && sevenSegItem.state && sevenSegItem.name === commonAnode.name) || (sevenSegItem.node === "CF" && commonAnode.state && sevenSegItem.name === commonAnode.name)) && <div className="CF_Off"></div>}
          {sevenSegItem.node === "CG" && !commonAnode.state && !sevenSegItem.state && sevenSegItem.name === commonAnode.name && <div className="CG_On"></div>}
          {((sevenSegItem.node === "CG" && !commonAnode.state && sevenSegItem.state && sevenSegItem.name === commonAnode.name) || (sevenSegItem.node === "CG" && commonAnode.state && sevenSegItem.name === commonAnode.name)) && <div className="CG_Off"></div>}
          {sevenSegItem.node === "DP" && !commonAnode.state && !sevenSegItem.state && sevenSegItem.name === commonAnode.name && <div className="DP_On"></div>}
          {((sevenSegItem.node === "DP" && !commonAnode.state && sevenSegItem.state && sevenSegItem.name === commonAnode.name) || (sevenSegItem.node === "DP" && commonAnode.state && sevenSegItem.name === commonAnode.name)) && <div className="DP_Off"></div>}
        </li>
      ))}
    </ul>
  )
}

export default SevenSegmentDisplay
