import { Component, lazy } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { Map } from 'immutable';

const LINGER_DURATION = 150;
const ShiftItem = lazy(() => import('ShiftItem'));
export const cellTarget = {
  drop(props) {
    const { day, position, shifts, user } = props;

    return { day, position, shifts, user };
  },
  canDrop() {
    return true;
  },
};

export const collect = (connect, monitor) => {
  const isOver = monitor.isOver({ shallow: true });

  return {
    connectDropTarget: connect.dropTarget(),
    isOver: isOver,
    draggedShift: isOver ? monitor.getItem() : null,
  };
};

export class ScheduleCell extends Component {


  state = {
    isLingering: false,
    tooltipOpen: false,
  };

  static propTypes = {
    canSchedule: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    day: PropTypes.object.isRequired,
    draggedShift: PropTypes.object,
    isOver: PropTypes.bool,
    location: PropTypes.number,
    openDialog: PropTypes.func.isRequired,
    position: PropTypes.object,
    shifts: PropTypes.object,
    // In coverage view the default users list can be empty, so we import the full list instead
    allLocationUsers: PropTypes.object.isRequired,
    highlightOpenshifts: PropTypes.bool.isRequired,
    showHeader: PropTypes.bool,
    startOfWeek: PropTypes.object,
    colWidth: PropTypes.number,
    inBulkEditMode: PropTypes.bool.isRequired,
    currentAccount: PropTypes.object,
    forecast: PropTypes.instanceOf(Map).isRequired,
    forecastType: PropTypes.string.isRequired,
    customUnitInfo: PropTypes.object,
  };

  static defaultProps = {
    showHeader: true,
  };

  render() {
    const { day, connectDropTarget, isOver, position } = this.props;

    const cell = (
       <div>
         IMMA CELL
         <ShiftItem id={1} />
         <ShiftItem id={2} />
         <ShiftItem id={3} />
       </div>
    );

    return connectDropTarget(cell);
  }
}

export default DropTarget('shift', cellTarget, collect)((ScheduleCell));
