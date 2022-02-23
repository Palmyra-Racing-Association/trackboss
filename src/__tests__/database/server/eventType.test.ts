import { PatchEventTypeRequest } from 'src/typedefs/eventType';
import { getEventType, getEventTypeList, insertEventType, patchEventType } from '../../../database/eventType';
import { mockQuery } from './mockQuery';

describe('insertEventType()', () => {
    it('Inserts a single event type', async () => {
        const request = { type: 'special event', modifiedBy: 2 };

        const result = await insertEventType(request);
        expect(result).toBe(50);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const request = { type: 'user erro', modifiedBy: 1 };

        await expect(insertEventType(request)).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const request = { type: '-100', modifiedBy: 1 };

        await expect(insertEventType(request)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const request = { type: '-200', modifiedBy: 1 };
        await expect(insertEventType(request)).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getEventType()', () => {
    it('Selects a single event type', async () => {
        const eventTypeId = 8;
        const origValues = [eventTypeId, 'Camp and Ride', '1/1/2020', 2, 'Isobel Jennery'];
        const result = await getEventType(eventTypeId);
        expect(mockQuery).toHaveBeenCalled();
        expect(result.eventTypeId).toBe(eventTypeId);
        expect(result.type).toBe(origValues[1]);
        expect(result.lastModifiedDate).toBe(origValues[2]);
        expect(result.lastModifiedBy).toBe(origValues[3]);
        expect(result.active).toBeTruthy();
    });

    it('Throws for event type not found', async () => {
        const eventTypeId = 765;
        await expect(getEventType(eventTypeId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const eventTypeId = -100;
        await expect(getEventType(eventTypeId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getEventTypeList()', () => {
    it('Returns an unfiltered list of event types', async () => {
        const results = await getEventTypeList();
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBeGreaterThan(1);
    });
});

describe('patchEventType()', () => {
    const testPatchWithObject = async (req: PatchEventTypeRequest) => {
        const eventTypeId = 10;
        // no error means success
        await patchEventType(eventTypeId, req);
        expect(mockQuery).toHaveBeenCalled();
    };

    it('Patches an event type with type field', async () => {
        await testPatchWithObject({ type: '2000', modifiedBy: 2 });
    });

    it('Patches an event type with active field', async () => {
        await testPatchWithObject({ active: false, modifiedBy: 2 });
    });

    it('Patches an event type with type and active field', async () => {
        await testPatchWithObject({ type: 'Test', active: true, modifiedBy: 1 });
    });

    it('Throws for event type not found', async () => {
        const eventTypeId = 3000;
        await expect(patchEventType(eventTypeId, { modifiedBy: 2 })).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const bikeId = 4000;
        await expect(patchEventType(bikeId, { modifiedBy: 2 })).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const bikeId = -100;
        await expect(patchEventType(bikeId, { modifiedBy: 2 })).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const bikeId = -200;
        await expect(patchEventType(bikeId, { modifiedBy: 2 })).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});
