import * as React from 'react';
import expect from 'expect';
import { render, fireEvent } from '@testing-library/react';
import { createTheme } from '@mui/material/styles';

import { AdminContext } from '../../AdminContext';
import { FilterButton } from './FilterButton';
import { TextInput } from '../../input';

const theme = createTheme();

describe('<FilterButton />', () => {
    const defaultProps = {
        resource: 'post',
        filters: [
            <TextInput source="title" label="Title" />,
            <TextInput source="customer.name" label="Name" />,
        ],
        displayedFilters: {
            title: true,
            'customer.name': true,
        },
        showFilter: () => {},
        filterValues: {},
    };

    describe('filter selection menu', () => {
        it('should display only hidden filters', () => {
            const hiddenFilter = (
                <TextInput source="Returned" label="Returned" />
            );
            const { getByLabelText, queryByText } = render(
                <AdminContext theme={theme}>
                    <FilterButton
                        {...defaultProps}
                        filters={defaultProps.filters.concat(hiddenFilter)}
                    />
                </AdminContext>
            );

            fireEvent.click(getByLabelText('ra.action.add_filter'));

            expect(queryByText('Returned')).not.toBeNull();
            expect(queryByText('Name')).toBeNull();
        });

        it('should return disabled filter menu item when "disabled" passed to filter', () => {
            const hiddenFilter = (
                <TextInput source="Returned" label="Returned" disabled={true} />
            );
            const { getByRole, getByLabelText } = render(
                <AdminContext theme={theme}>
                    <FilterButton
                        {...defaultProps}
                        filters={defaultProps.filters.concat(hiddenFilter)}
                    />
                </AdminContext>
            );

            fireEvent.click(getByLabelText('ra.action.add_filter'));

            const disabledFilter = getByRole('menuitem');

            expect(disabledFilter).not.toBeNull();
            expect(disabledFilter.getAttribute('aria-disabled')).toEqual(
                'true'
            );
        });
    });
});
