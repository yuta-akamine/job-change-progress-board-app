<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;
use App\Models\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $applications = Application::where('user_id', Auth::id())
            ->orderBy('status')
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Dashboard', [
            'applications' => $applications,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreApplicationRequest $request): RedirectResponse
    {
        $application = $request->user()->applications()->create(
            $request->validated()
        );

        return Redirect::back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateApplicationRequest $request, Application $application): RedirectResponse
    {
        $this->authorize('update', $application);

        $application->update($request->validated());

        return Redirect::back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Application $application): RedirectResponse
    {
        $this->authorize('delete', $application);

        $application->delete();

        return Redirect::back();
    }

    /**
     * Update the status of the specified resource.
     */
    public function updateStatus(Request $request, Application $application): JsonResponse
    {
        $this->authorize('updateStatus', $application);

        $request->validate([
            'status' => ['required', 'string', 'max:50'],
        ]);

        $application->update([
            'status' => $request->input('status'),
        ]);

        return response()->json(['success' => true]);
    }
}

