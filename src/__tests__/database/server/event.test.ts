import { PatchEventRequest } from 'src/typedefs/event';
import { deleteEvent, getEvent, getEventList, insertEvent, patchEvent } from '../../../database/event';
import { mockQuery } from './mockQuery';

describe('insertEvent()', () => {
    it('Inserts a single event', async () => {
        const request = {
            startDate: '2020-05-05',
            endDate: '2020-05-06',
            eventName: 'test event',
            eventTypeId: 2,
            eventDescription: 'test',
        };
        const result = await insertEvent(request);
        expect(result).toBe(321);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const request = { startDate: '2020-05-05', eventName: '1452', eventTypeId: 2, eventDescription: 'test' };
        await expect(insertEvent(request)).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const request = { startDate: '2020-05-05', eventName: '-100', eventTypeId: 2, eventDescription: 'test' };
        await expect(insertEvent(request)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const request = { startDate: '2020-05-05', eventName: '-200', eventTypeId: 2, eventDescription: 'test' };
        await expect(insertEvent(request)).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getEventList()', () => {
    it('Returns an unfiltered list of events', async () => {
        const results = await getEventList();
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBeGreaterThan(1);
    });

    it('Returns a filtered list of events on start time', async () => {
        const start = '2002-01-01';
        const results = await getEventList(start);
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBe(1);
        results.forEach((result) => {
            expect(Date.parse(result.start) > Date.parse(start));
        });
    });

    it('Returns a filtered list of events on end time', async () => {
        const end = '2002-01-01';
        const results = await getEventList(undefined, end);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(Date.parse(result.start) < Date.parse(end));
        });
    });

    it('Returns a filtered list of events on start and end time', async () => {
        const start = '2000-06-01';
        const end = '2002-01-01';
        const results = await getEventList(start, end);
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBe(1);
        results.forEach((result) => {
            expect(Date.parse(start) < Date.parse(result.start) && Date.parse(result.start) < Date.parse(end));
        });
    });

    it('Returns an empty list of events without error', async () => {
        const start = '2060-01-01';
        const results = await getEventList(start);
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBe(0);
    });

    it('Throws for internal server error', async () => {
        const date = '-100';
        await expect(getEventList(date)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getEvent()', () => {
    it('Selects a single event', async () => {
        const eventId = 10;
        const origValues = [
            10,
            '2001-01-01T08:00:00',
            '2001-01-02T08:00:00',
            'THE test event',
            'Test',
            'test desc',
        ];
        const result = await getEvent(eventId);
        expect(mockQuery).toHaveBeenCalled();
        expect(result.eventId).toBe(eventId);
        expect(result.start).toBe(origValues[1]);
        expect(result.end).toBe(origValues[2]);
        expect(result.eventType).toBe(origValues[3]);
        expect(result.title).toBe(origValues[4]);
        expect(result.eventDescription).toBe(origValues[5]);
    });

    it('Throws for member not found', async () => {
        const eventId = 765;
        await expect(getEvent(eventId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const eventId = -100;
        await expect(getEvent(eventId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('patchEvent()', () => {
    const testPatchWithObject = async (req: PatchEventRequest) => {
        const eventId = 42;
        // no error means success
        await patchEvent(eventId, req);
        expect(mockQuery).toHaveBeenCalled();
    };

    it('Patches an event with start date field', async () => {
        await testPatchWithObject({ startDate: '2022-02-05' });
    });
    it('Patches an event with end date field', async () => {
        await testPatchWithObject({ endDate: '2022-02-05' });
    });

    it('Patches an event with name field', async () => {
        await testPatchWithObject({ eventName: 'test test' });
    });

    it('Patches an event with description field', async () => {
        await testPatchWithObject({ eventDescription: 'testerville' });
    });

    it('Throws for user error', async () => {
        const eventId = 1451;
        await expect(patchEvent(eventId, { })).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for member not found', async () => {
        const eventId = 3000;
        await expect(patchEvent(eventId, { })).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const eventId = -100;
        await expect(patchEvent(eventId, { })).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const eventId = -200;
        await expect(patchEvent(eventId, { })).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('deleteEvent()', () => {
    it('deletes a single event', async () => {
        const eventId = 50;
        await deleteEvent(eventId);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const eventId = 5000;
        await expect(deleteEvent(eventId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const eventId = -100;
        await expect(deleteEvent(eventId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});
