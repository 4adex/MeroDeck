import { ApiResponse } from '@calimero-is-near/calimero-p2p-sdk';

import {
  ApprovalsCount,
  ContextDetails,
  ContractApi,
  ContractProposal,
  Members,
} from '../contractApi';
import { getStorageAppEndpointKey } from '../../utils/storage';
import axios from 'axios';
import { getConfigAndJwt } from './LogicApiDataSource';

export interface GetProposalsRequest {
  offset: number;
  limit: number;
}

export class ContextApiDataSource implements ContractApi {
  async getContractProposals(
    request: GetProposalsRequest,
  ): ApiResponse<ContractProposal[]> {
    try {
      const { jwtObject, error } = getConfigAndJwt();
      if (error) {
        return { error };
      }

      const apiEndpoint = `${getStorageAppEndpointKey()}/admin-api/contexts/${jwtObject.context_id}/proposals`;
      const body = request;

      const response = await axios.post(apiEndpoint, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data ?? [],
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
      };
    }
  }

  async getProposalApprovals(proposalId: String): ApiResponse<ApprovalsCount> {
    try {
      const { jwtObject, error } = getConfigAndJwt();
      if (error) {
        return { error };
      }
      const apiEndpoint = `${getStorageAppEndpointKey()}/admin-api/contexts/${jwtObject.context_id}/proposals/${proposalId}/approvals/users`;

      const response = await axios.get(apiEndpoint);

      return {
        data: response.data ?? [],
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
      };
    }
  }

  async getNumOfProposals(): ApiResponse<number> {
    try {
      const { jwtObject, error } = getConfigAndJwt();
      if (error) {
        return { error };
      }

      const apiEndpointLimit = `${getStorageAppEndpointKey()}/admin-api/contexts/${jwtObject.context_id}/proposals/count`;
      const limitResponse = await axios.get(apiEndpointLimit);

      const apiEndpoint = `${getStorageAppEndpointKey()}/admin-api/contexts/${jwtObject.context_id}/proposals`;
      const body = {
        offset: 0,
        limit: limitResponse.data.data,
      };

      const response = await axios.post(apiEndpoint, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data.data.length ?? 0,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
      };
    }
  }

  getContextDetails(): ApiResponse<ContextDetails> {
    // try {
    //   const headers: Header | null = await createAuthHeader(
    //     contextId,
    //     getNearEnvironment(),
    //   );
    //   const response = await this.client.get<ApiContext>(
    //     `${getAppEndpointKey()}/admin-api/contexts/${contextId}`,
    //     headers ?? {},
    //   );
    //   return response;
    // } catch (error) {
    //   console.error('Error fetching context:', error);
    //   return { error: { code: 500, message: 'Failed to fetch context data.' } };
    // }
    throw new Error('Method not implemented.');
  }
  getContextMembers(): ApiResponse<Members[]> {
    throw new Error('Method not implemented.');
  }
  getContextMembersCount(): ApiResponse<number> {
    throw new Error('Method not implemented.');
  }
}