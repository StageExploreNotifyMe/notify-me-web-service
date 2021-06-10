import Spinner from '../../components/util/Spinner';
import {act} from "react-dom/test-utils";
import {render} from "@testing-library/react";

test('Render Spinner Component', () => {
    act(() => {
        const {container} = render(<Spinner/>)
        expect(container.firstChild.classList.contains('loading')).toBe(true)
    })
}, 5000);
