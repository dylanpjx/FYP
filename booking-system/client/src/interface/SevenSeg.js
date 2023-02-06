import SevenSegmentDisplay from "./SevenSegmentDisplay";

const SevenSeg = ({ sevenSegState, sevenSegItems }) => {
  return (
    <div className="SevenSeg">
      <ul>
        {sevenSegState.map(commonAnode => (
          <li key={commonAnode.name} id={commonAnode.name}>
            <label>{commonAnode.name}</label>
            <SevenSegmentDisplay commonAnode={commonAnode} sevenSegItems={sevenSegItems}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SevenSeg
